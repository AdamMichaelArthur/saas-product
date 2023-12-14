#!/bin/bash

find_available_port_range() {
    local START_PORT=49152  # Starting port for search
    local END_PORT=65534    # Adjusted end port for search to accommodate 10-port range
    local REQUIRED_CONSECUTIVE=10

    for (( port=START_PORT; port<=END_PORT; port++ )); do
        local available=true

        for (( i=0; i<REQUIRED_CONSECUTIVE; i++ )); do
            if netstat -tuln | grep -q ":$((port+i))"; then
                available=false
                break
            fi
        done

        if $available; then
            echo $port
            return
        fi
    done
    echo "No available port range found" >&2
    return 1
}

# Detecting the operating system
# The install script behaves differently depending on whether it's a local or remote installation
OS_TYPE=$(uname -s)

# Use the OS_TYPE variable for checking the operating system
if [ "$OS_TYPE" = "Darwin" ]; then
    # MacOS specific code
    echo "Operating System is MacOS"
elif [ "$OS_TYPE" = "Linux" ]; then
    # Linux specific code
    echo "Operating System is Linux"
    # Further checks for Linux distributions can be done here
else
    echo "Unsupported operating system: $OS_TYPE"
    exit 1
fi

read -p "Enter Project Name: " projectName


while true; do
    read -p "Is this a (d) development installation or a (s) server installation? (d/s): " answer
    case "${answer,,}" in
        d)
            installFlavor="local"
            break
            ;;
        s)
            installFlavor="server"
            break
            ;;
        *)
            echo "Invalid response. Please answer l for local or s for server."
            ;;
    esac
done

HOST="127.0.0.1"

# Fetching the public IP address using an external service
public_ip=$(curl -s ifconfig.me)

# Check if the install flavor is 'server' and update HOST
if [ "$installFlavor" = "server" ]; then
    HOST=$public_ip
fi

if [ "$installFlavor" = "server" ]; then

    # This sets up the git remote, which is used for simplified deployments and source management
    chmod +x ./setup/project-create.sh
    ./setup/project-create.sh "$projectName"

    # Asking a yes/no question with a default option and handling 'q' for exit
    while true; do
        read -p "Would you like to setup this installation on a domain? (y/n/q): " answer
        case $answer in
            [Yy]* ) break;;
            [Nn]* ) break;;
            [Qq]* ) exit;;
            "" ) break;;
            * ) echo "Invalid response. Please answer y, n, or q.";;
        esac
    done

    if [ "${answer,,}" = "y" ]; then
        # Install the Shell Macros
        read -p "What's the domain name? " DOMAIN
        echo "Point An A Record from ${DOMAIN} To: $HOST"
    fi
    else
        DOMAIN="app.example.com"
    fi

    while true; do
        read -p "Enter email address for root/admin user: " ADMIN_EMAIL
        echo "Email address entered: $ADMIN_EMAIL"
        read -p "Confirm email address: " CONFIRM_EMAIL

        if [ "$ADMIN_EMAIL" = "$CONFIRM_EMAIL" ]; then
            echo "Email address confirmed."
            break
        else
            echo "Email addresses do not match, please try again."
        fi
    done

    while true; do
        read -sp "Enter admin password: " ADMIN_PASS
        echo
        read -sp "Confirm admin password: " CONFIRM_PASS
        echo

        if [ "$ADMIN_PASS" = "$CONFIRM_PASS" ]; then
            echo "Password confirmed."
            break
        else
            echo "Passwords do not match, please try again."
        fi
    done

    while true; do
        read -sp "Choose a special, recovery password: " RECOVERY_ADMIN_PASS
        echo
        read -sp "Confirm recovery password: " RECOVERY_CONFIRM_PASS
        echo

        if [ "$RECOVERY_ADMIN_PASS" = "$RECOVERY_CONFIRM_PASS" ]; then
            echo "Password confirmed."
            break
        else
            echo "Passwords do not match, please try again."
        fi
    done

    # This sets and copies the repo into the git directory, which will now become the "source of truth"
    cp -a .git/. "/srv/git/${projectName}.git/"

    # Init the repo as an empty git repository
    sudo git init --bare

    # Define group recursively to "users", on the directories
    sudo chgrp -R users .

    # Define permissions recursively, on the sub-directories
    # g = group, + add rights, r = read, w = write, X = directories only
    # . = curent directory as a reference
    sudo chmod -R g+rwX .

    # Sets the setgid bit on all the directories
    # https://www.gnu.org/software/coreutils/manual/html_node/Directory-Setuid-and-Setgid.html
    sudo find . -type d -exec chmod g+s '{}' +

    # Make the directory a shared repo
    sudo git config core.sharedRepository group

    # Now, we will copy the project files into our installation directory
    cp -r * "/srv/www/${projectName}/"

    # Run NPM Install in our project directories, where required
    #cd "/srv/www/${projectName}/app/apis/apiv1" && npm install
    cd "/srv/www/${projectName}/app/apis/apiv2" && npm install --loglevel=error

    # Install NPM Modules and Build Angular App
    cd "/srv/www/${projectName}/app/clients/angular" && npm install
    ng build
    #cd "/srv/www/${projectName}/app/clients/react" && npm install

    # Discover available ports
    available_port=$(find_available_port_range)
    echo "Available port range starts at: $available_port"

    API_V1_PORT=$available_port
    API_V2_PORT=$((available_port + 5))

    # MongoDB connection details with defaults
    DB_DOMAIN="127.0.0.1"
    DB_PORT="27017"
    DB_USERNAME=""  # Set to empty initially
    DB_PASSWORD=""  # Set to empty initially
    AUTH_DB="admin"  # Default auth db

ask_details() {

    # Prompt user for optional overrides
    #echo "Enter MongoDB Domain (default: 127.0.0.1):" read inputDomain
    read -p "Enter MongoDB Domain (default: 127.0.0.1):" inputDomain
    if [ ! -z "$inputDomain" ]; then
        DB_DOMAIN="$inputDomain"
    fi

    #echo "Enter MongoDB Port (default: 27017):" read inputPort
    read -p "Enter MongoDB Port (default: 27017):" inputPort
    if [ ! -z "$inputPort" ]; then
        DB_PORT="$inputPort"
    fi

    #echo "Enter MongoDB Username (default: none):" read inputUsername
    read -p "Enter MongoDB Username (default: none):" inputUsername 
    if [ ! -z "$inputUsername" ]; then
        DB_USERNAME="$inputUsername"
    fi

    #echo "Enter MongoDB Password (default: none):" read inputPassword
    read -p "Enter MongoDB Password (default: none):" inputPassword
    if [ ! -z "$inputPassword" ]; then
        DB_PASSWORD="$inputPassword"
    fi

    #echo "Enter MongoDB Authentication Database (default: admin):" read inputAuthDb
    read -p "Enter MongoDB Authentication Database (default: admin):" inputAuthDb
    if [ ! -z "$inputAuthDb" ]; then
        AUTH_DB="$inputAuthDb"
    fi

    #echo "Enter your Stripe Development Key:" read stripeDevKey
    read -p "Enter your Stripe Development Key:" stripeDevKey
    if [ ! -z "$stripeDevKey" ]; then
        STRIPE_KEY="$stripeDevKey"
    fi

}

export SECRET_KEY=$(openssl rand -hex 32)

confirm() {
    echo "MongoDB Domain: $DB_DOMAIN"
    echo "MongoDB Port: $DB_PORT"
    echo "MongoDB Username: $DB_USERNAME"
    echo "MongoDB Password: $DB_PASSWORD"
    echo "MongoDB Auth Database: $AUTH_DB"
    echo "Stripe Dev Key: $STRIPE_KEY"
    read -p "Are these values correct? (y/n): " confirm
    case "${confirm,,}" in
        y) return 0;;
        n) return 1;;
        *) echo "Invalid response. Please answer y or n."; return 1;;
    esac
}

while true; do
    ask_details
    confirm && break
done
    WEBSOCKET_V2="$((API_V2_PORT + 2))"
    # Create our .env files, and load them with our first variables
    cd "/srv/env/${projectName}"
    sudo tee apiv1.env >/dev/null <<EOF
# Project Name
PROJECT_NAME=${projectName}
PORT=${API_V1_PORT}
WEBSOCKET_1=$((API_V1_PORT + 1))
WEBSOCKET_2=$((API_V1_PORT + 2))

# The stripe API key
stripe_key=${STRIPE_KEY}

# MongoDB Connection Details
DB_DOMAIN=${DB_DOMAIN}
DB_PORT="${DB_PORT}"
DB_USERNAME="${DB_USERNAME}"
DB_PASSWORD="${DB_PASSWORD}"
AUTH_DB="${AUTH_DB}"

EOF

echo "The secret key is ${SECRET_KEY}"

cp "/srv/env/${projectName}/apiv1.env" "/srv/www/${projectName}/app/apis/apiv1/.env"

    cd "/srv/env/${projectName}"
    sudo tee apiv2.env >/dev/null <<EOF
PROJECT_NAME=${projectName}
PORT=${API_V2_PORT}
WEBSOCKET_1=$((API_V2_PORT + 1))
WEBSOCKET_2=$((API_V2_PORT + 2))

# Recovery and Administrator Password
GOD_PASSWORD=${RECOVERY_ADMIN_PASS}
SECRET_KEY=${SECRET_KEY}

stripe_key=${STRIPE_KEY}

# MongoDB Connection Details
DB_DOMAIN=${DB_DOMAIN}
DB_PORT="${DB_PORT}"
DB_USERNAME="${DB_USERNAME}"
DB_PASSWORD="${DB_PASSWORD}"
DB_NAME="${projectName}"
AUTH_DB="${AUTH_DB}"
DB_REPLICASET = "rs0"
directConnection = "true"
socketTimeoutMS="360"
connectTimeoutMS="360"
DB="mongo" # currently unused, but the roadmap includes a plan to support sql, which will require a database provider

# For Affiliate Cookies
PRIMARY_DOMAIN="127.0.0.1"
PRIMARY_SUB_WEBSITE=""
PRIMARY_SUB_APP=""
PRIMARY_LINK="http://127.0.0.1:4201/"

# Default Directory Definitions
VERSION = "2.0"
PROD_PREFIX = ""
API_PREFIX="api/"
PRIMARY_PORT=":4201"
LOCAL="false"
BASE_URL = ""
SERVICE_NAME = ""

# Default Express Settings
DEFAULT_TIMEOUT=60
JSON_BODY_POST_SIZE_LIMIT='50mb'
TEXT_BODY_POST_SIZE_LIMIT='50mb'

EOF

    cp "/srv/env/${projectName}/apiv2.env" "/srv/www/${projectName}/app/apis/apiv2/.env"
    echo "nano /srv/www/${projectName}/app/apis/apiv2/.env"
    echo "Your git remote, assuming you have ssh keys installed and root access: root@${HOST}:/srv/git/${projectName}.git"
    echo "To clone: git clone ssh://root@${HOST}:/srv/git/${projectName}.git"

    cd "/srv/www/${projectName}/app/apis/apiv2/"
    pm2 start npm --name "${projectName}-apiv2" -- run start_prod
    pm2 save

    # Define the API endpoint
    ENDPOINT="http://${HOST}:${API_V2_PORT}/public/setup/test"

    echo $ENDPOINT

    # Sleeping for a few seconds, to give the API time to initialize
    sleep 3

    # Using curl to make the API call and check for 200 OK response
    response=$(curl -o /dev/null -s -w "%{http_code}\n" "$ENDPOINT")

    # Check if the response is 200 OK
    if [ "$response" -eq 200 ]; then
        echo "API is working fine.  Creating admin user"

    echo HOST
    echo API_V2_PORT
    echo ADMIN_EMAIL
    echo ADMIN_PASS
    echo RECOVERY_ADMIN_PASS

    curl --location "http://${HOST}:${API_V2_PORT}/register" \
    --header 'Content-Type: application/json' \
    --header 'Accept: application/json' \
    --data-raw "{
        \"userId\": \"${ADMIN_EMAIL}\",
        \"pwd\": \"${ADMIN_PASS}\",
        \"plan\": \"sysadmin\",
        \"adminPassword\": \"${RECOVERY_ADMIN_PASS}\",
        \"account_type\": \"user\",
        \"first_name\": \"Adam\",
        \"last_name\": \"Arthur\"
    }"


    else
        echo "API check failed with response code: $response"
    fi

    # Check for Nginx installation
    if ! command -v nginx >/dev/null 2>&1; then
        echo "Nginx is not installed. Would you like to install it? (yes/no)"
        read installNginx

        if [ "$installNginx" = "yes" ]; then
            echo "Installing Nginx for $DISTRO..."
            install_nginx "$DISTRO"
        else
            echo "Nginx installation skipped."
        fi
    else
        echo "Nginx is already installed."
    fi

    # Display Nginx configuration details for MacOS
    if [ "$OS" = "Darwin" ]; then
        NGINX_CONF_DIR="/usr/local/etc/nginx"  # Default directory for MacOS
        echo "Nginx Configuration Directory on MacOS: $NGINX_CONF_DIR"
    fi

    # Display Nginx configuration details for Linux distributions
    if [ "$OS" != "Darwin" ]; then
        NGINX_CONF_DIR="/etc/nginx"  # Default directory for Linux

        echo "Nginx Configuration Directory: $NGINX_CONF_DIR"
        if [ -d "$NGINX_CONF_DIR/sites-enabled" ]; then
            echo "Nginx Sites Enabled:"
            SITES_ENABLED="$NGINX_CONF_DIR/sites-enabled"
        else
            echo "Nginx sites-enabled directory not found."
        fi
    fi

    remote_addr="$remote_addr"
    proxy_add_x_forwarded_for="$proxy_add_x_forwarded_for"
    http_host="$http_host";
    http_upgrade="$http_upgrade"

    echo "${NGINX_CONF_DIR}/sites-enabled/${projectName}.conf"
    sudo tee "${SITES_ENABLED}/${projectName}.conf" >/dev/null <<EOF
server {
gzip_comp_level 6;
gzip_min_length 1100;
gzip_buffers 16 8k;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/js
    text/xml
    text/javascript
    application/javascript
    application/json
    application/xml
    application/rss+xml
    image/svg+xml;

    client_max_body_size 200M;

    access_log /var/log/nginx/${projectName}-access.log;
    error_log /var/log/nginx/${projectName}-error.log;

    server_name ${DOMAIN};
    listen 443 ssl;

    # This directs all "datasource" api requests to the ApiV1 Node App
    # The "datasource" api will eventually be ported to the new api.  But for now
    # it's a legacy dependency
    location ^~ /api/datasource {
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:${API_V1_PORT}/;
        proxy_set_header X-Forwarded-Proto https;
    }   

    # This directs all api requests to the ApiV2 Node App
    location ^~ /api/ {
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:${API_V2_PORT}/;
        proxy_set_header X-Forwarded-Proto https;
    }    

    location ^~ /${projectName}/api/ {
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:${API_V2_PORT}/;
        proxy_set_header X-Forwarded-Proto https;
    }   

    location /ws/socket.io/ {
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass "http://localhost:${WEBSOCKET_V2}/socket.io/";
    }

    location / {
        try_files \$uri \$uri/ /index.html =404;
        index index.html index.htm index.nginx-debian.html;
        root /srv/www/${projectName}/app/clients/angular/dist/saas-product;
    }

    ssl_certificate /etc/letsencrypt/live/saas-product.com-0001/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/saas-product.com-0001/privkey.pem;

}

server {
    if (\$host = ${projectName}.saas-product.com) {
        return 301 https://\$host\$request_uri;
    } # managed by Certbot

    server_name ${projectName}.saas-product.com;
    listen 80;
    return 404; # managed by Certbot

}

EOF

    # See if our configuration file is ok
    nginx -t
    systemctl restart nginx

fi

exit

# https://ap.www.namecheap.com/Domains/DomainControlPanel/coffee-explained.com/advancedns


read -p "Would you like to install Shell Macros? " answer
if [ "$answer" = "y" ]; then
    # Install the Shell Macros
fi

# Echo the public IP address and the final HOST value

read -p "What is the domain you pointed the A Record to? (enter to create one)" answer

exit;

# Find the public IP address of the device
public_ip=$(ip route get 1.2.3.4 | awk '{print $7}' | head -n 1)

# Echo the router IP address
echo "Router IP address of the device: $public_ip"

exit


OS=$(uname -s)
DISTRO="Unknown"

case "$OS" in
    Linux*)
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            DISTRO=$NAME
        fi
        ;;
    Darwin*)
        DISTRO="MacOS"
        ;;
    *)
        echo "Unsupported operating system: $OS"
        exit 1
        ;;
esac

echo "Operating System: $OS"
echo "Distribution: $DISTRO"

# Check for MongoDB installation
if command -v mongo >/dev/null 2>&1; then
    MONGO_INSTALLED="yes"
fi

# Check if running on MacOS
if [ "$(uname -s)" = "Darwin" ]; then
    # Check for Homebrew installation
    if ! command -v brew >/dev/null 2>&1; then
        echo "Homebrew is not installed. Would you like to install it? (yes/no)"
        read installBrew

        if [ "$installBrew" = "yes" ]; then
            # Install Homebrew
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        else
            echo "Homebrew installation skipped."
        fi
    else
        echo "Homebrew is already installed."
    fi
fi

# Check for MongoDB installation
if ! command -v mongo >/dev/null 2>&1; then
    echo "MongoDB is not installed. Would you like to install it locally? (yes/no)"
    read installMongo

    if [ "$installMongo" = "yes" ]; then
        case "$DISTRO" in
            "Ubuntu"|"Debian GNU/Linux")
                sudo apt-get update
                sudo apt-get install -y mongodb
                ;;
            "CentOS Linux")
                sudo yum update
                sudo yum install -y mongodb
                ;;
            "MacOS")
                brew update
                brew install mongodb
                ;;
            *)
                echo "Automatic installation not supported for this OS."
                exit 1
                ;;
        esac
    else
        echo "Would you like to use a FREE Hosted MongoDB database instead? (yes/no)"
        read useHostedMongo
        if [ "$useHostedMongo" = "yes" ]; then
            # Logic to configure the use of a hosted MongoDB
            echo "Configuring FREE Hosted MongoDB database... Please keep in mind this database should be considered insecure, unreliable and may be revoked or shutdown at any time, for any reason.  Use for development purposes only."
            # Add your configuration logic here
            DB_NAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
            # Generate 16-digit random alphanumeric strings for DB_USERNAME and PASSWORD
            DB_USERNAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)
            PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 16 | head -n 1)

            echo "Database Username: $DB_USERNAME"
            echo "Database Password: $PASSWORD"

        else
            echo "MongoDB setup skipped."
        fi
    fi
else
    echo "MongoDB is already installed."
fi

# Check if MongoDB is running
case "$OS" in
    Linux*)
        if ! systemctl is-active --quiet mongod; then
            echo "MongoDB must be running on 127.0.0.1 to continue"
            # exit 1
        fi
        ;;
    Darwin*)
        if ! pgrep -q mongod; then
            echo "MongoDB must be running on 127.0.0.1 to continue"
            # exit 1
        fi
        ;;
    *)
        echo "OS not supported for MongoDB running check."
        exit 1
        ;;
esac

echo "MongoDB is running."

# Informing the user about the system administrator requirement
echo "SaaS Product requires an initial user to be the system administrator."
echo "This is an all-access user that has super admin privileges."

# Prompting for system administrator's email and password
echo "Enter the email address for the system administrator:"
read sysAdminEmail

echo "Enter the password for the system administrator:"
read sysAdminPassword

# Echo values for verification
echo "System Administrator Email: $sysAdminEmail"
echo "System Administrator Password: $sysAdminPassword"

echo "Enter Production Domain (default: 127.0.0.1):"
read productionDomain

# Set to default if no input is given
if [ -z "$productionDomain" ]; then
    productionDomain="127.0.0.1"
fi

echo "Production Domain: $productionDomain"

# Function to install Nginx based on OS
install_nginx() {
    case "$1" in
        "Ubuntu"|"Debian GNU/Linux")
            sudo apt-get update
            sudo apt-get install -y nginx
            ;;
        "CentOS Linux")
            sudo yum update
            sudo yum install -y nginx
            ;;
        "MacOS")
            brew update
            brew install nginx
            ;;
        *)
            echo "Nginx installation not supported for this OS."
            return 1
            ;;
    esac
    echo "Nginx installed successfully."
}

# Assuming the URL is stored in a variable named URL
URL="http://example.com"

echo "Do you want to set up Gmail to send system administrator emails? (yes/no)"
read setupGmail

if [ "$setupGmail" = "yes" ]; then
    # Logic for setting up Gmail integration
    echo "Setting up Gmail integration..."

    # Check the OS and take action accordingly
    if [ "$OS_TYPE" = "Darwin" ]; then
        # MacOS - Open the URL automatically
        open "$URL"
    elif [ "$OS_TYPE" = "Linux" ]; then
        # Linux - Prompt user to manually open the URL
        echo "Cut and Paste This into a browser: $URL"
    else
        echo "Unsupported operating system for automatic URL opening."
    fi
else
    echo "Gmail setup skipped."
fi



# echo "Install nginx? (yes/no)"
# read installNginx

# echo "Install mongodb? (yes/no)"
# read installMongodb

# echo "Enter Stripe API Key:"
# read stripeApiKey

# # Use variables like $projectName, $productionDomain, etc. for further actions
# echo "Use Simple Integrations"
# read useSimpleIntegrations

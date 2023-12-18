#!/bin/bash

# Save our original cwd, we'll need it later
ORIG_PWD=$PWD
# MongoDB connection details with defaults
DB_DOMAIN="127.0.0.1"
DB_PORT="27017"
DB_USERNAME=""  # Set to empty initially
DB_PASSWORD=""  # Set to empty initially
AUTH_DB="admin"  # Default auth db

# Some defaults
SOCKET_IO_PATH="/socket.io/"

find_available_port_range() {
    local START_PORT=$((RANDOM % (65534 - 52152 + 1) + 52152))
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

    while true; do
        ask_details
        confirm && break
    done

    # Create a temporary file
    tmpFile=$(mktemp)

    # Copy the shebang line from the original file to the temporary file
    head -n 1 "install.local.sh" > "$tmpFile"

    # Append the projectName and installedDomain lines to the temporary file
    echo "projectName=${projectName}" >> "$tmpFile"
    echo "installedDomain=${DOMAIN}" >> "$tmpFile"

    # Append the rest of the original file, starting from the second line
    tail -n +2 "install.local.sh" >> "$tmpFile"

    # Replace the original file with the modified temporary file
    mv "$tmpFile" "install.local.sh"
    chmod +x "install.local.sh"

    # Essentially what we're doing here is starting with the GitHub project
    # Creating a brand-new repo, copying the files from the GitHub repo to
    # the new repo.  This creates the ability to have a new project repo
    # on our server with automatic deployment hooks.  It makes working on the
    # project and deploying it very easy.

    # Trash our existing git repo
    rm -rf .git

    # Clone the empty repository into our tmp
    git clone "/srv/git/${projectName}.git/" tmp

    # Move the project files into our empty, tmp directory
    find . -path ./tmp -prune -o -type f -exec cp --parents {} tmp/ \;

    cd tmp
    # Add the newly moved files to our empty git repo
    git add .

    # Create an initial commit
    git commit -m "First Commit"

    # Push the commit
    #git push

    echo "ssh://root@app.saas-product.com:/srv/git/${projectName}.git/"
    # https://github.com/AdamMichaelArthur/saas-product.git
    # This sets and copies the repo into the git directory, which will now become the "source of truth"
    #cp -a .git/. "/srv/git/${projectName}.git/"

    # Now, we will copy the project files into our installation directory
    cp -r * "/srv/www/${projectName}/"

    # Run NPM Install in our project directories, where required
    cd "/srv/www/${projectName}/app/apis/apiv1" && npm ci --loglevel=error
    cd "/srv/www/${projectName}/app/apis/apiv2" && npm ci --loglevel=error

    mkdir -p "/srv/node_modules/${projectName}/apiv1/node_modules"
    mkdir -p "/srv/node_modules/${projectName}/apiv2/node_modules"

    cp -r "/srv/www/${projectName}/app/apis/apiv2/node_modules" "/srv/node_modules/${projectName}/apiv2"
    cp -r "/srv/www/${projectName}/app/apis/apiv1/node_modules" "/srv/node_modules/${projectName}/apiv1"

    # Install NPM Modules and Build Angular App
    #cd "/srv/www/${projectName}/app/clients/angular" && npm install
    #ng build
    #cd "/srv/www/${projectName}/app/clients/react" && npm install

    # Discover available ports
    available_port=$(find_available_port_range)
    echo "Available port range starts at: $available_port"

    API_V1_PORT=$available_port
    API_V2_PORT=$((available_port + 5))

    WEBSOCKET_V2="$((API_V2_PORT + 2))"
    # Create our .env files, and load them with our first variables
    cd "/srv/env/${projectName}"
    sudo tee apiv1.env >/dev/null <<EOF
# Project Name
PROJECT_NAME=${projectName}
PORT=${API_V1_PORT}
WEBSOCKET_1=$((API_V1_PORT + 1))
WEBSOCKET_2=$((API_V2_PORT + 2))

# The stripe API key
stripe_key=${STRIPE_KEY}

# MongoDB Connection Details
DB_DOMAIN=${DB_DOMAIN}
DB_PORT="${DB_PORT}"
DB_USERNAME="${DB_USERNAME}"
DB_PASSWORD="${DB_PASSWORD}"
DB_NAME="${projectName}"
AUTH_DB="${AUTH_DB}"
DISABLE_BOX="true"

EOF

echo "The secret key is ${SECRET_KEY}"

cp "/srv/env/${projectName}/apiv1.env" "/srv/www/${projectName}/app/apis/apiv1/.env"

    cd "/srv/env/${projectName}"
    sudo tee apiv2.env >/dev/null <<EOF
PROJECT_NAME=${projectName}
PORT=${API_V2_PORT}
WEBSOCKET_1=$((API_V1_PORT + 1))
WEBSOCKET_2=$((API_V2_PORT + 2))
SOCKET_IO_PATH="/socket.io/"

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
    #pm2 start classes/Websockets/websockets.js --node-args="--loader esm-module-alias/loader --no-warnings" --name "${projectName}-websockets"
    pm2 start node --name "${projectName}-websockets" -- --loader esm-module-alias/loader --no-warnings classes/Websockets/websockets.js
    pm2 save

    cd "/srv/www/${projectName}/app/apis/apiv1/"
    pm2 start node app_entry_points/app_entry.js --name "${projectName}-apiv1"
    pm2 save
    # We stop it, because we haven't done an NPM Install at this point and it'll just error out.
    pm2 stop "${projectName}-apiv1"

    
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

    echo $HOST
    echo $API_V2_PORT
    echo $ADMIN_EMAIL
    echo $ADMIN_PASS
    echo $RECOVERY_ADMIN_PASS

    max_attempts=3
    attempt=1

    while [ $attempt -le $max_attempts ]; do
        echo "Attempt $attempt of $max_attempts"

        url="http://${HOST}:${API_V2_PORT}/register"
        json_payload=$(cat <<EOF
    {
        "userId": "${ADMIN_EMAIL}",
        "pwd": "${ADMIN_PASS}",
        "plan": "sysadmin",
        "adminPassword": "${RECOVERY_ADMIN_PASS}",
        "account_type": "user",
        "first_name": "Adam",
        "last_name": "Arthur"
    }
EOF
    )

        # Displaying the URL and JSON payload for debugging
        echo "URL: $url"
        echo "JSON Payload: $json_payload"

        curl --location "$url" \
            --header 'Content-Type: application/json' \
            --header 'Accept: application/json' \
            --data-raw "$json_payload" \
            --max-time 5

        status=$?
        if [ $status -eq 0 ]; then
            echo "Command succeeded"
            break
        else
            echo "Command failed"
        fi

        attempt=$((attempt+1))
        sleep 5 # wait for 5 seconds before retrying
    done

    if [ $attempt -gt $max_attempts ]; then
        echo "Command failed after $max_attempts attempts."
    fi



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

    location ^~ /v1.0/ {
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:${API_V1_PORT}/;
        proxy_set_header X-Forwarded-Proto https;
    }

    location ^~ /api/datasource {
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header Host \$http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass http://localhost:${API_V1_PORT};
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

    # This allows us to use a path for our websockets without having to specify a port in our requests
    location ${SOCKET_IO_PATH} {
      proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
      proxy_set_header Host \$host;
      proxy_pass http://localhost:${WEBSOCKET_V2};
      proxy_http_version 1.1;
      proxy_set_header Upgrade \$http_upgrade;
      proxy_set_header Connection "upgrade";

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

sudo tee "/srv/git/${projectName}.git/hooks/post-receive" >/dev/null <<EOF
#!/bin/bash

# Define the base project name
projectName="${projectName}"

# Stop the PM2 processes
echo 'Deploying Project To Production'
pm2 stop ${projectName}-apiv1
pm2 stop ${projectName}-apiv2

# The production directory
WWW="/srv/www/${projectName}"

# A temporary directory for deployment
TMP="/srv/tmp/${projectName}"

# The Git repo
GIT="/srv/git/${projectName}.git"

# The Env repo
ENV="/srv/env/${projectName}"


# Deploy the content to the temporary directory
mkdir -p \$TMP
git --work-tree=\$TMP --git-dir=\$GIT checkout -f

# Copy the env variable to the temporary directory
cp -a \$ENV/. \$TMP

# Do stuffs, like npm install
cd \$TMP || exit

# Replace the content of the production directory
# with the temporary directory
cd / || exit
rm -rf \$WWW
mv \$TMP \$WWW

# Do stuff like starting docker
cd \$WWW || exit
# docker-compose up -d --build


# Move our environment variables
cp "/srv/env/${projectName}/apiv1.env" "/srv/www/${projectName}/app/apis/apiv1/.env"
cp "/srv/env/${projectName}/apiv2.env" "/srv/www/${projectName}/app/apis/apiv2/.env"

cd "/srv/www/${projectName}/app/apis/apiv1"
cp -r "/srv/node_modules/${projectName}/apiv1/node_modules" "/srv/www/${projectName}/app/apis/apiv1"
npm install

cd "/srv/www/${projectName}/app/apis/apiv2"
cp -r "/srv/node_modules/${projectName}/apiv2/node_modules" "/srv/www/${projectName}/app/apis/apiv2"
npm install

# Build the react client, if present
cd "/srv/www/${projectName}/clients/react"
npm install

# Build the project locally
npm run build

# Build the react client, if present
cd "/srv/www/${projectName}/app/clients/angular"
npm ci

# Build the project locally
ng build

# Move this post-receive to the post-receive folder.  
mv /srv/www/${projectName}/deployment/post-receive /srv/git/${projectName}.git/hooks/post-receive

# Set the hook as an executable
chmod +x /srv/git/${projectName}.git/hooks/post-receive

# Copy the nginx configuration file to the sites-enabled directory
mv /srv/www/${projectName}/deployment/${projectName}.conf /etc/nginx/sites-enabled/${projectName}.conf

# Make sure the configuration files are good
nginx -t 

# And finally restart nginx to make the changes take effect
systemctl restart nginx

# Start our PM2 processes
pm2 start ${projectName}-apiv1
pm2 start ${projectName}-apiv2

EOF

cp "/srv/git/${projectName}.git/hooks/post-receive" $ORIG_PWD/tmp/deployment/post-receive
cd $ORIG_PWD/tmp
git add .
git commit -m "Moving Updated Post Receive Into Deployment Directory"

# This is going to take a while.
#nohup git push &>/dev/null &
 git push



echo -e "\n\n\n██████╗░░█████╗░███╗░░██╗███████╗\n██╔══██╗██╔══██╗████╗░██║██╔════╝\n██║░░██║██║░░██║██╔██╗██║█████╗░░\n██║░░██║██║░░██║██║╚████║██╔══╝░░\n██████╔╝╚█████╔╝██║░╚███║███████╗\n╚═════╝░░╚════╝░╚═╝░░╚══╝╚══════╝\n\n"

echo "The project is building in the background, and should come online when this is finished.  This can take a few minutes."
echo "Run: 'git clone ssh://root@${HOST}:/srv/git/${projectName}.git' on your development server to clone the deployed project."
echo "This assume that you have your ssh keys installed to this server."
echo "Would you like to make this available via https?  Warning: this means anyone with the link can download the repo."
echo "Use 'git push' and 'git pull' to update any changes to your deployment."
echo "Visit http://${DOMAIN} to see your deployment.  If after 10 minutes it's not working, something went wrong.  But less than 10 minutes, be patient."


exit

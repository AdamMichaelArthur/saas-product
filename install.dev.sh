#!/bin/bash

# Save our original cwd, we'll need it later
ORIG_PWD=$PWD
chmod 777 . || { echo "Failed to change permissions"; exit 1; }

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
    echo "Get A Test API Key -> https://dashboard.stripe.com/test/apikeys"
    echo "Don't have a Stripe account?  Leave it blank and the Stripe functionality will be disabled"
    echo "Note: If you plan on using any of the subscription / payment features, I strongly recommend"
    echo "you get a Stripe Account and API Key before beginning development"
    
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

    # Enable or disable stripe, depending on whether a key was provided
    ENABLE_STRIPE_COMMENT="#"
    # if [ -n "$STRIPE_KEY" ]; then
    #     ENABLE_STRIPE_COMMENT=""
    # fi

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
# We disable stripe by default
stripe_key=${STRIPE_KEY}
${ENABLE_STRIPE_COMMENT}DISABLE_STRIPE=true

# API_VERSION 
API_VERSION=""

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
${ENABLE_STRIPE_COMMENT}DISABLE_STRIPE=true

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
        cd $ORIG_PWD

        curl --location "$url" \
            --header 'Content-Type: application/json' \
            --header 'Accept: application/json' \
            --data-raw "$json_payload" \
            --cookie-jar "cookies.txt" \
            --max-time 5

        status=$?
        if [ $status -eq 0 ]; then
            echo "Command succeeded"
            break
        else
            # Restart mongod
            echo "Attempint to restart mongodb"
            systemctl restart mongod
            sleep 10 # wait for 10 seconds before retrying
            echo "Command failed.  Restarting process and waiting 10 seconds, then trying again"
            pm2 restart "${projectName}-apiv2"
            sleep 10
        fi

        attempt=$((attempt+1))
        sleep 5 
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
pm2 start ${projectName}-websockets

EOF

cp "/srv/git/${projectName}.git/hooks/post-receive" $ORIG_PWD/tmp/deployment/post-receive
cd $ORIG_PWD/tmp
git add .
git commit -m "Moving Updated Post Receive Into Deployment Directory"

# This is going to take a while.
#nohup git push &>/dev/null &
 git push

##################################################################################################
# Calling /administration/plans/getPlans for the first time causes Stripe plans to get initialized
##################################################################################################
if [ -n "$STRIPE_KEY" ]; then
    echo $STRIPE_KEY
    cd $ORIG_PWD
    setPlansUrl="http://${HOST}:${API_V2_PORT}/administration/plans/getPlans"
    echo "Waiting 10 seconds for the process to initialize"
    sleep 10
    echo "Attemping to set stripe plans"
    echo $setPlansUrl
    curl --location "$setPlansUrl" \
         --cookie "cookies.txt" \
         --max-time 5 \
         --header 'Accept: application/json'
fi
##################################################################################################

##################################################################################################
# Calling /administration/plans/getApiKey to generate an API Key for the primary admin user
##################################################################################################

    cd $ORIG_PWD
    getApiKeyUrl="http://${HOST}:${API_V2_PORT}/administration/getApiKey"
    sleep 2
    echo "Attemping to intialize Api Key for priamry sysadmin user"
    echo $getApiKeyUrl

    # Make the API call and store the response
    response=$(curl --location "$getApiKeyUrl" \
             --cookie "cookies.txt" \
             --max-time 5 \
             --header 'Accept: application/json')

    # Extract the apiKey value from the JSON response
    apiKey=$(echo $response | grep -o '"api_key":"[^"]*' | grep -o '[^"]*$')

    # Check if the apiKey is not null or empty
    if [ -n "$apiKey" ]; then
        echo "Extracted apiKey: $apiKey"
        # Use the apiKey as needed
    else
        echo "apiKey not found in the response"
    fi

##################################################################################################

##################################################################################################
# Setting up Stripe Webhooks
##################################################################################################
    stripeWebhookResponse=$(curl -o /dev/null -s -w "%{http_code}\n" "https://${DOMAIN}/api/public/callbacks/stripe/event")
    stripeWebhookUrl="https://${DOMAIN}/api/public/callbacks/stripe/event/api_key/${apiKey}"
    echo "Our stripe webbook is: ${stripeWebhookUrl}"
    echo "Our stripe API Key is ${STRIPE_KEY}"
    # Assuming 'response' contains the HTTP status code

    # Check if the response is 200 OK
    if [ "$stripeWebhookResponse" -eq 200 ]; then
        echo "API is working fine. Let's setup our callback"
        

    curl https://api.stripe.com/v1/webhook_endpoints \
      -u ${STRIPE_KEY}: \
      -d "url=${stripeWebhookUrl}" \
      -d "enabled_events[]=account.updated" \
      -d "enabled_events[]=account.application.authorized" \
      -d "enabled_events[]=account.application.deauthorized" \
      -d "enabled_events[]=account.external_account.created" \
      -d "enabled_events[]=account.external_account.deleted" \
      -d "enabled_events[]=account.external_account.updated" \
      -d "enabled_events[]=application_fee.created" \
      -d "enabled_events[]=application_fee.refunded" \
      -d "enabled_events[]=application_fee.refund.updated" \
      -d "enabled_events[]=balance.available" \
      -d "enabled_events[]=billing_portal.configuration.created" \
      -d "enabled_events[]=billing_portal.configuration.updated" \
      -d "enabled_events[]=billing_portal.session.created" \
      -d "enabled_events[]=capability.updated" \
      -d "enabled_events[]=cash_balance.funds_available" \
      -d "enabled_events[]=charge.captured" \
      -d "enabled_events[]=charge.expired" \
      -d "enabled_events[]=charge.failed" \
      -d "enabled_events[]=charge.pending" \
      -d "enabled_events[]=charge.refunded" \
      -d "enabled_events[]=charge.succeeded" \
      -d "enabled_events[]=charge.updated" \
      -d "enabled_events[]=charge.dispute.closed" \
      -d "enabled_events[]=charge.dispute.created" \
      -d "enabled_events[]=charge.dispute.funds_reinstated" \
      -d "enabled_events[]=charge.dispute.funds_withdrawn" \
      -d "enabled_events[]=charge.dispute.updated" \
      -d "enabled_events[]=charge.refund.updated" \
      -d "enabled_events[]=checkout.session.async_payment_failed" \
      -d "enabled_events[]=checkout.session.async_payment_succeeded" \
      -d "enabled_events[]=checkout.session.completed" \
      -d "enabled_events[]=checkout.session.expired" \
      -d "enabled_events[]=coupon.created" \
      -d "enabled_events[]=coupon.deleted" \
      -d "enabled_events[]=coupon.updated" \
      -d "enabled_events[]=credit_note.created" \
      -d "enabled_events[]=credit_note.updated" \
      -d "enabled_events[]=credit_note.voided" \
      -d "enabled_events[]=customer.created" \
      -d "enabled_events[]=customer.deleted" \
      -d "enabled_events[]=customer.updated" \
      -d "enabled_events[]=customer.discount.created" \
      -d "enabled_events[]=customer.discount.deleted" \
      -d "enabled_events[]=customer.discount.updated" \
      -d "enabled_events[]=customer.source.created" \
      -d "enabled_events[]=customer.card.created" \
      -d "enabled_events[]=customer.bank_account.created" \
      -d "enabled_events[]=customer.source.deleted" \
      -d "enabled_events[]=customer.card.deleted" \
      -d "enabled_events[]=customer.bank_account.deleted" \
      -d "enabled_events[]=customer.source.expiring" \
      -d "enabled_events[]=customer.source.updated" \
      -d "enabled_events[]=customer.card.updated" \
      -d "enabled_events[]=customer.bank_account.updated" \
      -d "enabled_events[]=customer.subscription.created" \
      -d "enabled_events[]=customer.subscription.deleted" \
      -d "enabled_events[]=customer.subscription.paused" \
      -d "enabled_events[]=customer.subscription.pending_update_applied" \
      -d "enabled_events[]=customer.subscription.pending_update_expired" \
      -d "enabled_events[]=customer.subscription.resumed" \
      -d "enabled_events[]=customer.subscription.trial_will_end" \
      -d "enabled_events[]=customer.subscription.updated" \
      -d "enabled_events[]=customer.tax_id.created" \
      -d "enabled_events[]=customer.tax_id.deleted" \
      -d "enabled_events[]=customer.tax_id.updated" \
      -d "enabled_events[]=customer_cash_balance_transaction.created" \
      -d "enabled_events[]=file.created" \
      -d "enabled_events[]=financial_connections.account.created" \
      -d "enabled_events[]=financial_connections.account.deactivated" \
      -d "enabled_events[]=financial_connections.account.disconnected" \
      -d "enabled_events[]=financial_connections.account.reactivated" \
      -d "enabled_events[]=financial_connections.account.refreshed_balance" \
      -d "enabled_events[]=identity.verification_session.canceled" \
      -d "enabled_events[]=identity.verification_session.created" \
      -d "enabled_events[]=identity.verification_session.processing" \
      -d "enabled_events[]=identity.verification_session.requires_input" \
      -d "enabled_events[]=identity.verification_session.verified" \
      -d "enabled_events[]=invoice.created" \
      -d "enabled_events[]=invoice.deleted" \
      -d "enabled_events[]=invoice.finalization_failed" \
      -d "enabled_events[]=invoice.finalized" \
      -d "enabled_events[]=invoice.marked_uncollectible" \
      -d "enabled_events[]=invoice.paid" \
      -d "enabled_events[]=invoice.payment_action_required" \
      -d "enabled_events[]=invoice.payment_failed" \
      -d "enabled_events[]=invoice.payment_succeeded" \
      -d "enabled_events[]=invoice.sent" \
      -d "enabled_events[]=invoice.upcoming" \
      -d "enabled_events[]=invoice.updated" \
      -d "enabled_events[]=invoice.voided" \
      -d "enabled_events[]=invoiceitem.created" \
      -d "enabled_events[]=invoiceitem.deleted" \
      -d "enabled_events[]=issuing_authorization.created" \
      -d "enabled_events[]=issuing_authorization.updated" \
      -d "enabled_events[]=issuing_card.created" \
      -d "enabled_events[]=issuing_card.updated" \
      -d "enabled_events[]=issuing_cardholder.created" \
      -d "enabled_events[]=issuing_cardholder.updated" \
      -d "enabled_events[]=issuing_dispute.closed"

    else
        echo "API call failed with status: $response"
        # Handle failure case
    fi

##################################################################################################
# Creating Test Accounts
##################################################################################################
echo "Sleeping for 10 seconds"
sleep 10

echo "Creating Account 1"

user1=$(curl --location "https://${DOMAIN}/api/register" \
--cookie-jar "free-account-cookie.txt" \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data-raw "{
    \"userId\":\"free@${DOMAIN}\",
    \"pwd\":\"password\",
    \"first_name\": \"Free\",
    \"last_name\":\"Account\"
}")

echo "Response:"
echo $user1
echo "End response"
echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

echo "\nCreating Account 2"

user2=$(curl --location "https://${DOMAIN}/api/register" \
--cookie-jar "pro-account-cookie.txt" \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data-raw "{
    \"userId\":\"pro@${DOMAIN}\",
    \"pwd\":\"password\",
    \"first_name\": \"Pro\",
    \"last_name\":\"Account\"
}")

echo "Response:"
echo $user2
echo "End response"
echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

echo "Creating Account 3"

user3=$(curl --location "https://${DOMAIN}/api/register" \
--cookie-jar "enterprise-account-cookie.txt" \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data-raw "{
    \"userId\":\"enterprise@${DOMAIN}\",
    \"pwd\":\"password\",
    \"first_name\": \"Enterprise\",
    \"last_name\":\"Account\"
}")

echo "Response:"
echo $user3
echo "End response"
echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

##################################################################################################
# Creating A Test Clock
##################################################################################################

echo "Creating Test Clocks"

response=$(curl https://api.stripe.com/v1/test_helpers/test_clocks \
  -u ${STRIPE_KEY}: \
  -d frozen_time=$(date +%s))

echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

# Extracting the id
TEST_CLOCK_ID=$(echo $response | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')

echo "The test clock id is ${TEST_CLOCK_ID}"

# Create a Customer

echo "Creating Customer 1"

CUSTOMER_RESPONSE_1=$(curl https://api.stripe.com/v1/customers \
  -u ${STRIPE_KEY}: \
  --data-urlencode email="free@${DOMAIN}" \
  -d test_clock=$TEST_CLOCK_ID \
  -d payment_method=pm_card_visa \
  -d "invoice_settings[default_payment_method]"=pm_card_visa)

echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

echo "Creating Customer 2"

CUSTOMER_RESPONSE_2=$(curl https://api.stripe.com/v1/customers \
  -u ${STRIPE_KEY}: \
  --data-urlencode email="pro@${DOMAIN}" \
  -d test_clock=$TEST_CLOCK_ID \
  -d payment_method=pm_card_visa \
  -d "invoice_settings[default_payment_method]"=pm_card_visa)

echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

echo "Creating Customer 3"

CUSTOMER_RESPONSE_3=$(curl https://api.stripe.com/v1/customers \
  -u ${STRIPE_KEY}: \
  --data-urlencode email="enterprise@${DOMAIN}" \
  -d test_clock=$TEST_CLOCK_ID \
  -d payment_method=pm_card_visa \
  -d "invoice_settings[default_payment_method]"=pm_card_visa)

echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

echo $CUSTOMER_RESPONSE_1

echo $CUSTOMER_RESPONSE_2

echo $CUSTOMER_RESPONSE_3

CUSTOMER_ID_1=$(echo $CUSTOMER_RESPONSE_1 | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')

CUSTOMER_ID_2=$(echo $CUSTOMER_RESPONSE_2 | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')

CUSTOMER_ID_3=$(echo $CUSTOMER_RESPONSE_3 | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')

echo "CUSTOMER_ID_1 is ${CUSTOMER_ID_1}"

echo "CUSTOMER_ID_3 is ${CUSTOMER_ID_2}"

echo "CUSTOMER_ID_3 is ${CUSTOMER_ID_3}"

##################################################################################################
# Get our plans, so we can grab our price_ids
##################################################################################################

echo "Calling https://${DOMAIN}/api/plans/getPlans"
echo "Sleeping for 10 seconds"
sleep 10

json_response=$(curl --location "https://${DOMAIN}/api/plans/getPlans" \
--cookie "enterprise-account-cookie.txt" \
--header 'Content-Type: application/json' \
--header 'Accept: application/json')

echo "Sleeping for 2 seconds to avoid rate limits"
sleep 2

echo "Response:"
echo $json_response
echo "End Response"
# Extracting priceId values
price_ids=$(echo "$json_response" | grep -o '"priceId": *"[^"]*' | awk -F '"' '{print $4}')

price_id_1=$(echo "$price_ids" | sed -n 1p)
price_id_2=$(echo "$price_ids" | sed -n 2p)
price_id_3=$(echo "$price_ids" | sed -n 3p)

# Print each variable
echo "Price ID 1: $price_id_1"
echo "Price ID 2: $price_id_2"
echo "Price ID 3: $price_id_3"

##################################################################################################
# Create our Subscriptions
##################################################################################################

SUBSCRIPTION_RESPONSE_1=$(curl https://api.stripe.com/v1/subscriptions \
 -u $STRIPE_KEY: \
 -d customer=$CUSTOMER_ID_1 \
 -d items[0][price]=$price_id_1)

echo $SUBSCRIPTION_RESPONSE_1
echo "Sleeping for 2 seconds to avoid rate limits"
SUBSCRIPTION_ID_1=$(echo "$SUBSCRIPTION_RESPONSE_1" | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')
sleep 2
echo "The subscription id for free ${SUBSCRIPTION_ID_1}"

SUBSCRIPTION_RESPONSE_2=$(curl https://api.stripe.com/v1/subscriptions \
 -u $STRIPE_KEY: \
 -d customer=$CUSTOMER_ID_2 \
 -d items[0][price]=$price_id_2)

echo "Sleeping for 2 seconds to avoid rate limits"
SUBSCRIPTION_ID_2=$(echo "$SUBSCRIPTION_RESPONSE_2" | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')

sleep 2
echo "The subscription id for pro ${SUBSCRIPTION_ID_2}"

SUBSCRIPTION_RESPONSE_3=$(curl https://api.stripe.com/v1/subscriptions \
 -u $STRIPE_KEY: \
 -d customer=$CUSTOMER_ID_3 \
 -d items[0][price]=$price_id_3)

echo "Sleeping for 2 seconds to avoid rate limits"
SUBSCRIPTION_ID_3=$(echo "$SUBSCRIPTION_RESPONSE_3" | grep -o '"id": *"[^"]*' | grep -o '[^"]*$')

sleep 2
echo "The subscription id for enterprise ${SUBSCRIPTION_ID_3}"

##################################################################################################
# Updating the database
##################################################################################################


sid_1=$(echo $SUBSCRIPTION_RESPONSE_1 | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -n 1)
sid_2=$(echo $SUBSCRIPTION_RESPONSE_2 | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -n 1)
sid_3=$(echo $SUBSCRIPTION_RESPONSE_3 | grep -o '"id": "[^"]*' | grep -o '[^"]*$' | head -n 1)

echo "Customer id 1: ${CUSTOMER_ID_1} END"
echo "Subscription id 1: ${sid_1} END"

curl -v --location "https://${DOMAIN}/api/testclocks/attachStripeClockCustomerToAccount" \
--header 'Content-Type: application/json' \

--cookie "free-account-cookie.txt" \                                                                          
--data-raw "{ \"stripe_id\": \"${CUSTOMER_ID_1}\", \"subscription_id\": \"${sid_1}\", \"plan\":\"free\" }"

echo "Customer id 2:-${CUSTOMER_ID_2}-END"
echo "Subscription id 2:-${sid_2}-END"
curl -v --location "https://${DOMAIN}/api/testclocks/attachStripeClockCustomerToAccount" \
--header 'Content-Type: application/json' \
--cookie "pro-account-cookie.txt" \
--data-raw "{ 
    \"stripe_id\": \"${CUSTOMER_ID_2}\",
    \"subscription_id\": \"${sid_2}\",
    \"plan\":\"pro\"
}"

echo "Customer id 1: ${CUSTOMER_ID_3} END"
echo "Subscription id 1: ${sid_3} END"

curl -v --location "https://${DOMAIN}/api/testclocks/attachStripeClockCustomerToAccount" \
--header 'Content-Type: application/json' \
--cookie "enterprise-account-cookie.txt" \
--data-raw "{ 
    \"stripe_id\": \"${CUSTOMER_ID_3}\",
    \"subscription_id\": \"${sid_3}\",
    \"plan\":\"enterprise\" 
}"

##################################################################################################
# Doing a final check to see if the Angular frontend built.  If not, we're going to try again
##################################################################################################
response=$(curl -o /dev/null -s -w "%{http_code}\n" "https://${DOMAIN}")

if [ "$response" -eq 404 ]; then
    # Place your code block here
    echo "The Angular App isn't working correctly"
    # This sometimes happens in the original build of the frontend fails.
    # The most common reason for this is deploying on a new server with limited resource
    # and can be fixed by creating a system swap file
fi


echo -e "\n\n\n██████╗░░█████╗░███╗░░██╗███████╗\n██╔══██╗██╔══██╗████╗░██║██╔════╝\n██║░░██║██║░░██║██╔██╗██║█████╗░░\n██║░░██║██║░░██║██║╚████║██╔══╝░░\n██████╔╝╚█████╔╝██║░╚███║███████╗\n╚═════╝░░╚════╝░╚═╝░░╚══╝╚══════╝\n\n"


echo "git clone ssh://root@${HOST}:/srv/git/${projectName}.git"
echo "Visit https://${DOMAIN}"


exit

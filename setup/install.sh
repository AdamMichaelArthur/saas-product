#!/bin/sh

#!/bin/bash

read -p "Enter Project Name: " answer

chmod +x ./setup/create-project.sh

./setup/project-create.sh "$answer"

exit;

# Detecting the operating system
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

HOST="127.0.0.1"

# Fetching the public IP address using an external service
public_ip=$(curl -s ifconfig.me)

# Check if the install flavor is 'server' and update HOST
if [ "$installFlavor" = "server" ]; then
    HOST=$public_ip
fi

read -p "Would you like to install Shell Macros? " answer
if [ "$answer" = "y" ]; then
    # Install the Shell Macros
fi

read -p "Would you like to setup this installation on a domain? " answer
if [ "$answer" = "y" ]; then
    # Install the Shell Macros
    read -p "What's the domain name? " DOMAIN
    echo "Point An A Record from ${DOMAIN} To: $HOST"
fi

# Asking a simple yes/no question
read -p "Is this a local (development) installation or a server (remote) installation? (dev/server) " answer

# Converting the answer to a boolean variable
installFlavor="local"
if [ "$answer" = "server" ]; then
    installFlavor="server"
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

# MongoDB connection details with defaults
DB_DOMAIN="localhost"
DB_PORT="27017"
DB_USERNAME=""  # Set to empty initially
DB_PASSWORD=""  # Set to empty initially
AUTH_DB="admin"  # Default auth db

# Prompt user for optional overrides
echo "Enter MongoDB Domain (default: localhost):"
read inputDomain
if [ ! -z "$inputDomain" ]; then
    DB_DOMAIN="$inputDomain"
fi

echo "Enter MongoDB Port (default: 27017):"
read inputPort
if [ ! -z "$inputPort" ]; then
    DB_PORT="$inputPort"
fi

echo "Enter MongoDB Username (default: none):"
read inputUsername
if [ ! -z "$inputUsername" ]; then
    DB_USERNAME="$inputUsername"
fi

echo "Enter MongoDB Password (default: none):"
read inputPassword
if [ ! -z "$inputPassword" ]; then
    DB_PASSWORD="$inputPassword"
fi

echo "Enter MongoDB Authentication Database (default: admin):"
read inputAuthDb
if [ ! -z "$inputAuthDb" ]; then
    AUTH_DB="$inputAuthDb"
fi

# Echo values for verification
echo "MongoDB Domain: $DB_DOMAIN"
echo "MongoDB Port: $DB_PORT"
echo "MongoDB Username: $DB_USERNAME"
echo "MongoDB Password: $DB_PASSWORD"
echo "MongoDB Auth Database: $AUTH_DB"

# Check if MongoDB is running
case "$OS" in
    Linux*)
        if ! systemctl is-active --quiet mongod; then
            echo "MongoDB must be running on localhost to continue"
            # exit 1
        fi
        ;;
    Darwin*)
        if ! pgrep -q mongod; then
            echo "MongoDB must be running on localhost to continue"
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

echo "Enter Production Domain (default: localhost):"
read productionDomain

# Set to default if no input is given
if [ -z "$productionDomain" ]; then
    productionDomain="localhost"
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
        ls "$NGINX_CONF_DIR/sites-enabled"
    else
        echo "Nginx sites-enabled directory not found."
    fi
fi

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
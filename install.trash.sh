
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

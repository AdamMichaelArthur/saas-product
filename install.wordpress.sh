#!/bin/bash

WORDPRESSDIR="/mnt/volume_sfo2_01/wordpress-sites"
PROJECT_NAME="testsite"
PROJECT_DIR="${WORDPRESSDIR}/${PROJECT_NAME}"
DOMAIN="${PROJECT_NAME}.saas-product.com"

# Check if Nginx is installed
if ! which nginx > /dev/null; then
    sudo apt install -y nginx
else
    echo "Nginx is already installed."
fi

# Check if MariaDB is installed
if ! which mysql > /dev/null; then
    sudo apt install -y mariadb-server
else
    echo "MariaDB is already installed."
fi

# Install PM2
if ! which pm2 > /dev/null; then
    sudo npm install pm2@latest -g
else
    echo "PM2 is already installed."
fi

# Install Certbot
if ! which certbot > /dev/null; then
    sudo apt install -y certbot
else
    echo "Certbot is already installed."
fi

# Create directory and change directory into it
sudo mkdir -p "${WORDPRESSDIR}/${PROJECT_NAME}"
cd "${WORDPRESSDIR}/${PROJECT_NAME}"

# Prompt user for username and password
read -p "Enter username: " username
read -sp "Enter password: " password
echo

# Login to MySQL and create a user with the provided credentials
mysql -u root -p -e "CREATE USER '$username'@'localhost' IDENTIFIED BY '$password';"

# Flush privileges
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Prompt user for database name
read -p "Enter the name of the database: " dbname

# Create database
mysql -u root -p -e "CREATE DATABASE $dbname;"

# Download and unzip WordPress
wget https://wordpress.org/latest.zip
unzip latest.zip

# Move WordPress files to current working directory
mv wordpress/* .

# Set permissions for WordPress directories
sudo chown -R www-data:www-data $PROJECT_DIR
sudo find $PROJECT_DIR -type d -exec chmod 755 {} \;
sudo find $PROJECT_DIR -type f -exec chmod 644 {} \;
sudo chmod 775 $PROJECT_DIR/wp-content
sudo chmod 775 $PROJECT_DIR/wp-content/uploads
sudo chmod 775 $PROJECT_DIR/wp-content/plugins
sudo chmod 775 $PROJECT_DIR/wp-content/themes

sudo tee "${PROJECT_DIR}.conf" >/dev/null <<EOF
server {
	root ${PROJECT_DIR};
	index index.php index.html;
	server_name ${DOMAIN};

	access_log ${PROJECT_DIR}/access.log;
    error_log ${PROJECT_DIR}/error.log;

	location / {
    	try_files \$uri \$uri/ /index.php\$is_args\$args;
	}
    
    location ~ \.php$ {
		include snippets/fastcgi-php.conf;
        fastcgi_pass 127.0.0.1:9000;
    }

    location ~ /\.ht {
        deny all;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    location = /robots.txt {
        allow all;
        log_not_found off;
        access_log off;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires max;
        log_not_found off;
    }
}
EOF

cp "${PROJECT_DIR}.conf" "/etc/nginx/sites-enabled${PROJECT_DIR}.conf"

sudo certbot --nginx -d $DOMAIN


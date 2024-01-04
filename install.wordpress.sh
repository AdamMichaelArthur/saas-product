#!/bin/bash

WORDPRESSDIR="/mnt/volume_sfo2_01/wordpress-sites"
PROJECT_NAME="plugin-dev"
PROJECT_DIR="${WORDPRESSDIR}/${PROJECT_NAME}"
DOMAIN="${PROJECT_NAME}.saas-product.com"
SITES_ENABLED=/etc/nginx/sites-enabled

read -p "Enter the name of the project: " PROJECT_NAME

echo PROJECT_NAME

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
    read -p "Enter root database username: " db_root_username
    read -sp "Enter root database password: " db_root_password
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

cd $WORDPRESSDIR
# Create directory and change directory into it
sudo mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# Prompt user for username and password
read -p "Enter username: " username
read -sp "Enter password: " password
echo

# Login to MySQL and create a user with the provided credentials
mysql -u $db_root_username -p$db_root_password -e "CREATE USER '$username'@'localhost' IDENTIFIED BY '$password';"

# Grant user access only to the specified database
read -p "Enter the name of the database: " dbname

# Create database
mysql -u $db_root_username -p$db_root_password -e "CREATE DATABASE $dbname;"

mysql -u $db_root_username -p$db_root_password -e "GRANT ALL PRIVILEGES ON $dbname.* TO '$username'@'localhost';"

# Flush privileges
mysql -u $db_root_username -p$db_root_password -e "FLUSH PRIVILEGES;"

# Download and unzip WordPress
wget https://wordpress.org/latest.zip
unzip latest.zip

# Move WordPress files to current working directory
mv wordpress/* .

# Create the uploads directory, so we can set its permissions as needed
mkdir -p wp-content/uploads

# Set permissions for WordPress directories
sudo chown -R www-data:www-data $PROJECT_DIR
sudo find $PROJECT_DIR -type d -exec chmod 755 {} \;
sudo find $PROJECT_DIR -type f -exec chmod 644 {} \;
sudo chmod 775 $PROJECT_DIR/wp-content
sudo chmod 775 $PROJECT_DIR/wp-content/uploads
sudo chmod 775 $PROJECT_DIR/wp-content/plugins
sudo chmod 775 $PROJECT_DIR/wp-content/themes

echo "${PROJECT_DIR}/${PROJECT_NAME}.conf"

sudo tee $PROJECT_NAME.conf >/dev/null <<EOF
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

echo $pwd

cp $PROJECT_NAME.conf" $SITES_ENABLED/$PROJECT_NAME.conf"

sudo certbot --nginx -d $DOMAIN


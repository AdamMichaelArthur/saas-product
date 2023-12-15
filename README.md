# Installation Guide

## Prerequisites
- A cloud server (e.g., Digital Ocean, Amazon Cloud Server, Rackspace Server)
- Ubuntu 20
- Node 20

## Installation Steps
1. Create a cloud server (Digital Ocean recommended).
2. Point an A record to your server's IP on your domain (e.g., app.mydomain.com).
3. SSH into the server.
4. Clone the repo: `git clone https://github.com/AdamMichaelArthur/saas-product.git`
5. Change directory: `cd saas-product`
6. Run the installation script: `bash install.sh`

## Note
- The script currently does not install dependencies.
- Manual installation required for: nginx, mongodb, node 20, pm2, openssl, certbot.

## Clone the newly-cloned project to your local machine for development
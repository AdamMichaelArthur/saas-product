#!/bin/bash

# Variables
USER="root"
SERVER="app.saas-product.com"
API_V1_PATH="post-receive"
REMOTE_DIR_V1="/srv/git/saas-product.git/hooks"

# Upload .env file using scp
scp "$API_V1_PATH" "${USER}@${SERVER}:${REMOTE_DIR_V1}"


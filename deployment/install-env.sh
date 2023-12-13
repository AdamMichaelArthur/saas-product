#!/bin/bash

# Variables
USER="root"
SERVER="app.saas-product.com"
API_V1_PATH="../saas-product/api/.env"
API_V2_PATH="../saas-product/apiv2/.env"

REMOTE_DIR_V1="/srv/env/hammerheadads-client-frontend/apiv1"
REMOTE_DIR_V2="/srv/env/hammerheadads-client-frontend/apiv2"

# Upload .env file using scp
scp "$API_V1_PATH" "${USER}@${SERVER}:${REMOTE_DIR_V1}"
scp "$API_V2_PATH" "${USER}@${SERVER}:${REMOTE_DIR_V2}"

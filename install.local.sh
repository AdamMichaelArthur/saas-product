#!/bin/bash

npm install -g chokidar

ORIG_PWD=$PWD

scp -o StrictHostKeyChecking=no root@$installedDomain:/srv/www/$projectName/app/apis/apiv1/.env app/apis/apiv1
scp -o StrictHostKeyChecking=no root@$installedDomain:/srv/www/$projectName/app/apis/apiv2/.env app/apis/apiv2

# echo $apiv1Env
# echo $apiv2Env

# Comment out the existing DB_DOMAIN line

# Absolute path to the .env file
FILE="app/apis/apiv1/.env"

# Check if the file exists
if [ ! -f "$FILE" ]; then
    echo "File not found: $FILE"
    exit 1
fi

# Comment out the existing DB_DOMAIN line
sed -i '' '/^DB_DOMAIN/s/^/#/' "$FILE"

# Add a new line after the commented DB_DOMAIN line
awk -v domain="$installedDomain" '/^#DB_DOMAIN/ && !added {print; print "DB_DOMAIN="domain; added=1; next}1' "$FILE" > tmp && mv tmp "$FILE"

FILE="app/apis/apiv2/.env"
sed -i '' '/^DB_DOMAIN/s/^/#/' "$FILE"
awk -v domain="$installedDomain" '/^#DB_DOMAIN/ && !added {print; print "DB_DOMAIN="domain; added=1; next}1' "$FILE" > tmp && mv tmp "$FILE"

loadPort() {
    local envFile="$1"

    # Check if the .env file exists
    if [ ! -f "$envFile" ]; then
        echo "Error: File not found: $envFile" >&2
        return 1
    fi

    # Load PORT value from the .env file
    local port=$(grep '^PORT=' "$envFile" | cut -d '=' -f2)

    # Check if PORT value is loaded
    if [ -z "$port" ]; then
        echo "Error: PORT value not found in $envFile" >&2
        return 1
    fi

    # Return the loaded PORT value
    echo "$port"
}

cd "${ORIG_PWD}"
cd "app/apis/apiv2/"
pm2 stop "${projectName}-apiv2"
pm2 delete "${projectName}-apiv2"


cd "${ORIG_PWD}"
cd "app/apis/apiv1/"
pm2 stop "${projectName}-apiv1"
pm2 delete "${projectName}-apiv1"

# Usage example
cd "${ORIG_PWD}"
envFileApiv1="app/apis/apiv1/.env"
portApiv1=$(loadPort "$envFileApiv1")
echo $portApiv1

cd "${ORIG_PWD}"
envFileApiv2="app/apis/apiv2/.env"
portApiv2=$(loadPort "$envFileApiv2")
echo $portApiv2

# Install node_modules
cd "${ORIG_PWD}"
cd app/apis/apiv1
npm ci
pm2 start nodemon --name "${projectName}-apiv1"
pm2 stop "${projectName}-apiv1"
pm2 save

cd "${ORIG_PWD}"
cd app/apis/apiv2
npm ci
pm2 start npm --name "${projectName}-apiv2" -- run start
pm2 stop "${projectName}-apiv2"
pm2 start node --name "${projectName}-websockets" -- --loader esm-module-alias/loader --no-warnings classes/Websockets/websockets.js
pm2 stop "${projectName}-websockets"
pm2 save

cd "${ORIG_PWD}"
cd app/clients/angular
npm ci
pm2 stop "${projectName}-angular"
pm2 delete "${projectName}-angular"
pm2 start ng --name "${projectName}-angular" -- serve
pm2 stop "${projectName}-angular"
pm2 save

cd "${ORIG_PWD}"

# We need to setup our angular proxies.

# Define the directory and file path
dirPath="app/clients/angular"
jsonFile="${dirPath}/proxy.conf.json"

# Create the directory if it doesn't exist
if [ ! -d "$dirPath" ]; then
    mkdir -p "$dirPath"
fi

echo $portApiv2

# JSON content
cat << EOF > "$jsonFile"
{
  "/api/datasource/*": {
    "target": "http://localhost:${portApiv1}",
    "secure": false
  },
  "/api/actions/*": {
    "target": "http://localhost:${portApiv1}",
    "secure": false
  },
  "/api/*": {
    "target": "http://localhost:${portApiv2}",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  },
  "/v1.0/*": {
    "target": "http://localhost:${portApiv1}",
    "secure": false,
    "pathRewrite": {
      "^/v1.0(/|$)": "/"
    }
  }
}
EOF

# Confirm file creation
if [ -f "$jsonFile" ]; then
    echo "File created successfully: $jsonFile"
else
    echo "Failed to create file: $jsonFile"
fi

# Now we update the angular file

newPort=$((portApiv1 - 10))

echo "Angular Local Port ${newPort}"

dirPath="app/clients/angular"
angularJson="${dirPath}/angular.json"

cd "${ORIG_PWD}"
rm "${angularJson}"

cat << EOF > "$angularJson"
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "saas-product": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:application": {
          "strict": false
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/saas-product",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css",
              //"@angular/material/prebuilt-themes/indigo-pink.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "saas-product:build:production"
            },
            "development": {
              "browserTarget": "saas-product:build:development"
            }
          },
          "defaultConfiguration": "development",
          "options": { "proxyConfig": "./proxy.conf.json", "port": ${newPort} }
        },
        "extract-i18n": {
          "builder": "@angular-devkit/build-angular:extract-i18n",
          "options": {
            "browserTarget": "saas-product:build"
          }
        },
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "src/test.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.spec.json",
            "karmaConfig": "karma.conf.js",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "@angular/material/prebuilt-themes/indigo-pink.css",
              "src/styles.css"
            ],
            "scripts": []
          }
        }
      }
    }
  }
}
EOF

cd "${ORIG_PWD}"
cd "app/apis/apiv2/"
pm2 restart "${projectName}-websockets"
node --loader esm-module-alias/loader --no-warnings classes/Websockets/testclient.server.js
node --loader esm-module-alias/loader --no-warnings classes/Websockets/testclient.local.js

cd "${ORIG_PWD}/deployment"
scp -o StrictHostKeyChecking=no "root@${installedDomain}:/etc/nginx/sites-enabled/${projectName}.conf" "${projectName}.conf"
scp -o StrictHostKeyChecking=no "root@${installedDomain}:/srv/env/${projectName}/apiv1.env" "apiv1.env"
scp -o StrictHostKeyChecking=no "root@${installedDomain}:/srv/env/${projectName}/apiv2.env" "apiv2.env"

echo "The project should be live on https://localhost:${newPort}"

cd setup
pm2 start ecosystem.config.js
pm2 save
pm2 startup
pm2 restart "${projectName}-angular"
pm2 restart "${projectName}-apiv1"
pm2 restart "${projectName}-apiv2"
pm2 logs 

const chokidar = require('chokidar');
const path = require('path');
const { exec } = require('child_process');

require('dotenv').config()


var projectName = "saas-product";
var cwd = path.resolve('.');
const parentDir = path.dirname(__dirname);

var SERVER="nodemon-server.saas-product.com"
var REMOTEUSER="root"
var PATH_REMOTE=`/srv/www/${projectName}/app`
var PATH_LOCAL=`${parentDir}/app`

// Initialize watching on current directory and subdirectories
let watcher = chokidar.watch(PATH_LOCAL, { ignored: /(^|[\/\\])\../, persistent: true });

function getRelativePath(filePath, localPath, remotePath) {
    if (filePath.startsWith(localPath)) {
        return filePath.substring(localPath.length).replace(/^\//, '');
    } else {
        throw new Error("File path does not start with the local path");
    }
}

// Event listeners
watcher
  .on('add', filePath => {

  })
  .on('change', filePath => {

    const source = filePath;
    let relativePath = getRelativePath(filePath, PATH_LOCAL, PATH_REMOTE);
    const destination = `scp ${filePath} ${REMOTEUSER}@${SERVER}:${PATH_REMOTE}/${relativePath}`;
    
    const directoryPath = path.dirname(`${PATH_REMOTE}/${relativePath}`);

    console.log(41, directoryPath);

    let mkDir = `ssh ${REMOTEUSER}@${SERVER} "mkdir -p ${directoryPath}"`

    exec(mkDir, (error, stdout, stderr) => {
    
    console.log(44, mkDir);
        exec(destination, (error, stdout, stderr) => {
            if (error) {
                console.error(`Execution error: ${error}`);
                return;
            }
        });
        console.log(destination);
      })
    })

  .on('unlink', filePath => console.log(`File ${path} has been removed`))
  .on('addDir', filePath => {

  })
  .on('unlinkDir', filePath => console.log(`Directory ${path} has been removed`))
  .on('error', error => console.log(`Watcher error: ${error}`))
  .on('ready', () => console.log('Initial scan complete. Ready for changes'));


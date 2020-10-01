// Constants defined for fs and path
const fs = require('fs');
const path = require('path');

const logsPath = path.join(__dirname, '..', 'logs');

// Create Directory function
function createDir() {
  fs.mkdirSync(logsPath);
}

// Create file function
function createFile(filename) {
  fs.writeFileSync(path.join(logsPath, `${filename}.log`), '');
}

// Define Main function - calling Create DIR and File
function main() {
  if (fs.existsSync(logsPath)) {
    console.log('Logs already exists');
    return;
  }
  createDir();
  createFile('app');
  createFile('error');
}

// Calling the main function
main();

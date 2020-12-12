const fs = require('fs');
const path = require('path');

const logsPath = path.join(__dirname, '..', 'logs');

function createDir() {
  fs.mkdirSync(logsPath);
}

function createFile(filename) {
  fs.writeFileSync(path.join(logsPath, `${filename}.log`), '');
}

function main() {
  if (fs.existsSync(logsPath)) {
    console.log('Logs already exists');
    return;
  }
  createDir();
  createFile('app');
  createFile('error');
}

main();

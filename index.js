const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const FILE_PATH = process.env.FILE_PATH || './public';
const UUID = process.env.UUID || '89c13786-25aa-4520-b2e7-12cd60fb5202';
const ARGO_DOMAIN = process.env.ARGO_DOMAIN || '';
const ARGO_AUTH = process.env.ARGO_AUTH || '';
const ArgoPort = process.env.ARGO_PORT || 8080;

const app = express();

!fs.existsSync(FILE_PATH) ? (fs.mkdirSync(FILE_PATH), console.log(FILE_PATH + ' is created')) : console.log(FILE_PATH + ' already exists');

app.get('/', (_req, res) => {
  res.send('Hello world!');
});

async function downloadFile(fileName, fileUrl) {
  const filePath = path.join(FILE_PATH, fileName);
  const writer = fs.createWriteStream(filePath);

  try {
    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    });

    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('Download ' + fileName + ' successfully');
    return filePath;
  } catch (error) {
    console.error('Download ' + fileName + ' failed: ' + error.message);
    throw error;
  }
}

async function downloadFilesAndRun() {
  // ... (unchanged)
}

function cleanFiles() {
  setTimeout(() => {
    exec('rm -rf ' + path.join(FILE_PATH, 'boot.log') + ' ' + path.join(FILE_PATH, 'config.json'), (error) => {
      if (error) {
        console.error('Error while deleting files: ' + error);
        return;
      }
      console.log('App is running');
    });
  }, 0x186a0);
}

async function startServer() {
  await downloadFilesAndRun();
}

startServer();
app.listen(ArgoPort, () => console.log('Http server is running on: ' + ArgoPort + '!'));
const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const folderPath = path.join(__dirname, 'secret-folder');
let isFirst = true;

fs.promises.readdir(folderPath, { withFileTypes: true })
  .then(res => {
    res.forEach((file) => {
      if (!file.isDirectory()) {
        const filePath = path.join(__dirname, 'secret-folder', file.name);
        const fileName = path.basename(filePath);
        const fileExt = path.extname(filePath);

        fs.promises
          .stat(filePath)
          .then((res) => {
            if (isFirst) {
              stdout.write(`—————————\n`);
              stdout.write(`${fileName.replace(fileExt, '')} - ${fileExt.replace('.', '')} - ${res.size} byte\n`);
              isFirst = false;
            } else {
              stdout.write(`${fileName.replace(fileExt, '')} - ${fileExt.replace('.', '')} - ${res.size} byte\n`);
            }
          });
      }
    });
  })

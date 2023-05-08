const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(distPath);

fs.promises
  .readdir(stylesPath)
  .then((files) => {
    files.forEach((file) => {
      const filePath = path.join(stylesPath, file);
      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath);

      if (fileExt === '.css') {
        const input = fs.createReadStream(path.join(stylesPath, fileName));
        input.on('data', (data) => {
          output.write(`${data.toString()}\n`);
        })
      }
    })
  })

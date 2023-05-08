const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const projectDist = path.join(__dirname, 'project-dist');
const templateHtml = path.join(__dirname, 'template.html');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const indexHtmlDist = path.join(projectDist, 'index.html');
const styleCssDist = path.join(projectDist, 'style.css');
const assetsPathDist = path.join(projectDist, 'assets');

const errMsg = (err) => stdout.write('⚠ Error', err.message);

fs.mkdir(projectDist, { recursive: true }, (err) => err ? stdout.write(err) : null);

const readStream = fs.createReadStream(templateHtml, 'utf-8');
let startTemplate = '';

readStream.on('data', (chunk) => startTemplate += chunk);
readStream.on('end', () => insertComponent(startTemplate));
readStream.on('error', (err) => errMsg(err));

async function insertComponent(text) {
  fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
    err ? stdout.write(err) : null;

    const tags = text.match(/{{(.*?)}}/g);
    tags.forEach((item) => {
      const tag = item.split('').filter((e) => !/[\{\}]/g.test(e)).join('').trim();
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(componentsPath, file.name);
          fs.stat(filePath, (err) => {
            const obj = path.parse(path.resolve(file.name));
            if (err) {
              throw err;
            } else {
              if (obj.ext === '.html' && obj.name === tag) {
                let component = '';
                const readFile = fs.createReadStream(filePath, 'utf-8')
                readFile.on('data', (chunk) => component += chunk)
                readFile.on('end', () => {
                  text = text.replace(item, '\n' + component + '\n')
                  const writeIndex = fs.createWriteStream(indexHtmlDist)
                  writeIndex.write(text)
                })
                readFile.on('error', (err) => errMsg(err))
              }
            }
          })
        }
      })
    })
  })
}

const writeStream = fs.createWriteStream(path.join(styleCssDist));
fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    throw err;
  } else {
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(stylesPath, file.name);
        fs.stat(filePath, (err) => {
          const obj = path.parse(path.resolve(file.name))
          if (err) {
            throw err;
          } else {
            if (obj.ext === '.css') {
              const readStyles = fs.createReadStream(filePath, 'utf-8')
              readStyles.on('data', (chunk) => writeStream.write(chunk + '\n\n'))
              readStyles.on('error', (err) => errMsg(err))
            }
          }
        })
      }
    })
  }
})

async function copyDir(source, copy) {
  fs.mkdir(copy, { recursive: true }, (err) => err ? stdout.write(err) : null)
  fs.readdir(source, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    } else {
      files.forEach((file) => {
        const fileName = file.name;

        if (file.isFile()) {
          const filePath = path.join(source, fileName);
          const copyFilePath = path.join(copy, fileName);

          fs.stat(filePath, (err, stats) => {
            if (err) {
              throw err;
            } else {
              fs.copyFile(filePath, copyFilePath, (err) => err ? stdout.write(err) : null)
            }
          })
        } else {
          const subFolder = path.join(source, file.name);
          const copySubFolder = path.join(copy, file.name);
          copyDir(subFolder, copySubFolder);
        }
      })
    }
  })
}

fs.rm(assetsPathDist, { recursive: true, force: true }, () => {
  copyDir(assetsPath, assetsPathDist)
  stdout.write('-----------------------\n✔ Project-dist created!\n-----------------------')
});
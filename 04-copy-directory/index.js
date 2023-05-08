const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

fs.mkdir(destDir, { recursive: true }, (err) => {
  if (err) throw err;
  fs.readdir(destDir, { withFileTypes: true }, (err, arr) => {
    if (err) {
      throw err;
    } else {
      const files = arr
        .filter(file => file.isFile())
        .map(file => file.name);

      files.forEach((file) => {
        const deleteFile = path.join(destDir, file);

        fs.unlink(deleteFile, (err) => {
          if (err) throw err;
        });
      })
    }

    fs.readdir(srcDir, { withFileTypes: true }, (err, arr) => {
      if (err) {
        throw err;
      } else {
        const files = arr
          .filter(file => file.isFile())
          .map(file => file.name);

        files.forEach((file) => {
          const oldFile = path.join(srcDir, file);
          const newFile = path.join(destDir, file);

          fs.copyFile(oldFile, newFile, (err) => {
            if (err) throw err;
          });
        })
      }
    });
  });
});

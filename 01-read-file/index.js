const path = require('path');
const fs = require('fs');
const { stdout } = require('process');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8')

stream.on('data', (data) => stdout.write(data))
stream.on('error', (err) => stdout.write('Error: ', err.message))

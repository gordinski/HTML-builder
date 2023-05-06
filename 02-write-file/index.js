const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');
const output = fs.createWriteStream(path.join(__dirname, 'log.txt'));

stdout.write('Hi! Please enter something in the console...\n');

const printByeMessage = () => {
  stdout.write('\nBye, good luck!\n');
  exit()
};

stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    printByeMessage();
  }

  output.write(data);

  stdout.write('Please enter something in the console...\n');
})

process.on('SIGINT', printByeMessage);

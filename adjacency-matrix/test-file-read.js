const fs = require('fs');

const file1 = './data_small.txt';
const file2 = './data_large.txt';

function findConnectedShapes(file) {
  const readFile = fs.readFileSync(file, 'utf-8').trim().split('\n');
  const grid = readFile.map((line) => line.split('').map(Number))
  return grid;
}

console.log(findConnectedShapes(file1));
// .then((res) => console.log(res))
// .catch(err => console.error(err));

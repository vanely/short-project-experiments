const fs = require('fs');

const file1 = './data_small.txt';
const file2 = './data_large.txt';

function findConnections(filename) {
  let count = 0;
  const data = fs.readFileSync(filename, 'utf8').trim().split('\n');
  // console.log(`data:\n${data}`);
  const grid = data.map(line => line.split('').map(Number));
  // console.log(grid)
  const rows = grid.length;
  const cols = grid[0].length;

  function recursiveDepthSearch(i, j) {
    if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] === 0) {
      return 0;
    }

    grid[i][j] = 0;

    return 1 + recursiveDepthSearch(i - 1, j) + recursiveDepthSearch(i + 1, j) + recursiveDepthSearch(i, j - 1) + recursiveDepthSearch(i, j + 1);
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        const shapeSize = recursiveDepthSearch(i, j);
        if (shapeSize > 1) {
          count++;
        }
      }
    }
  }

  return count;
}

console.log(`\nNumber of connections file1: ${findConnections(file1)}`);
console.log(`\nNumber of connections file2: ${findConnections(file2)}`);

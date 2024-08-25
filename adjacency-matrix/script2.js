const fs = require('fs');

function countConnectedShapes(filename) {
  let count = 0;
  const data = fs.readFileSync(filename, 'utf8').trim().split('\n');
  const grid = data.map(line => line.split('').map(Number));

  const rows = grid.length;
  const cols = grid[0].length;

  // mark all connections in one go
  function recursiveDepthSearch(i, j) {
    if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] === 0) {
      return;
    }

    grid[i][j] = 0;

    recursiveDepthSearch(i - 1, j);  // up
    recursiveDepthSearch(i + 1, j);  // down
    recursiveDepthSearch(i, j - 1);  // left
    recursiveDepthSearch(i, j + 1);  // right
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (grid[i][j] === 1) {
        recursiveDepthSearch(i, j);
        count++;
      }
    }
  }

  return count;
}

const file1 = './data_small.txt';
const file2 = './data_large.txt';

// console.log(`Number of connected shapes in file1: ${countConnectedShapes(file1)}`);
console.log(`\nNumber of connected shapes in file2: ${countConnectedShapes(file2)}`);

// script.js
const data = [
  { name: "Alice", age: 25, email: "alice@example.com" },
  { name: "Bob", age: 30, email: "bob@example.com" },
  { name: "Charlie", age: 35, email: "charlie@example.com" },
  { name: "David", age: 28, email: "david@example.com" },
  { name: "Eve", age: 22, email: "eve@example.com" }
];

let currentSort = {
  column: null,
  direction: 'asc'
};

function generateTable(data) {
  const tableBody = document.getElementById('table-body');
  const tableHeader = document.getElementById('table-header');

  // Clear previous table data
  tableBody.innerHTML = '';
  tableHeader.innerHTML = '';

  // Dynamically create table headers
  if (data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      const headerCell = document.createElement('th');
      headerCell.textContent = key.charAt(0).toUpperCase() + key.slice(1);
      headerCell.onclick = () => sortTable(key);
      tableHeader.appendChild(headerCell);
    });
  }

  // Create table rows
  data.forEach(item => {
    const row = document.createElement('tr');
    for (const key in item) {
      const cell = document.createElement('td');
      cell.textContent = item[key];
      row.appendChild(cell);
    }
    tableBody.appendChild(row);
  });
}

function sortTable(column) {
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.direction = 'asc';
  }

  const sortedData = [...data].sort((a, b) => {
    if (a[column] < b[column]) {
      return currentSort.direction === 'asc' ? -1 : 1;
    }
    if (a[column] > b[column]) {
      return currentSort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  generateTable(sortedData);
}

document.getElementById('search').addEventListener('input', function () {
  const searchTerm = this.value.toLowerCase();
  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm)
    )
  );
  generateTable(filteredData);
});

// Initial table generation
generateTable(data);
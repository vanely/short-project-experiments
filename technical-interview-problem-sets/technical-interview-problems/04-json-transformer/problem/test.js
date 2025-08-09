const { transformJson } = require('./transformer');

// Helper function to check if two objects are deeply equal
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || obj1 === null ||
      typeof obj2 !== 'object' || obj2 === null) {
    return obj1 === obj2;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

// Test Case 1: Test all transformation types with the example from the README
function testExample() {
  const input = {
    customerData: {
      id: 12345,
      firstName: "john",
      lastName: "doe",
      joinDate: "12/31/2022"
    },
    orders: [
      { id: 1, total: 99.99, date: "01/15/2023", status: "completed" },
      { id: 2, total: 149.99, date: "02/20/2023", status: "pending" },
      { id: 3, total: 49.99, date: "03/10/2023", status: "completed" }
    ]
  };

  const transformationRules = [
    { type: "rename", from: "customerData.firstName", to: "customerData.first_name" },
    { type: "rename", from: "customerData.lastName", to: "customerData.last_name" },
    { type: "format", field: "customerData.first_name", formatType: "uppercase" },
    { type: "format", field: "customerData.last_name", formatType: "uppercase" },
    { type: "format", field: "customerData.joinDate", formatType: "date" },
    { type: "filter", field: "orders", condition: { field: "status", operator: "eq", value: "completed" } },
    { type: "calculate", targetField: "orderStats.totalSpent", operation: "sum", sourceField: "orders", valueField: "total" },
    { type: "calculate", targetField: "orderStats.orderCount", operation: "count", sourceField: "orders" }
  ];

  const expected = {
    customerData: {
      id: 12345,
      first_name: "JOHN",
      last_name: "DOE",
      joinDate: "2022-12-31"
    },
    orders: [
      { id: 1, total: 99.99, date: "01/15/2023", status: "completed" },
      { id: 3, total: 49.99, date: "03/10/2023", status: "completed" }
    ],
    orderStats: {
      totalSpent: 149.98,
      orderCount: 2
    }
  };

  const result = transformJson(input, transformationRules);
  console.assert(deepEqual(result, expected), 
    `Test failed: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
}

// Test Case 2: Test "rename" transformation
function testRename() {
  const input = {
    user: {
      name: "Alice",
      email: "alice@example.com",
      details: {
        age: 30,
        location: "New York"
      }
    }
  };

  const transformationRules = [
    { type: "rename", from: "user.name", to: "user.fullName" },
    { type: "rename", from: "user.details.location", to: "user.address.city" }
  ];

  const expected = {
    user: {
      fullName: "Alice",
      email: "alice@example.com",
      details: {
        age: 30
      },
      address: {
        city: "New York"
      }
    }
  };

  const result = transformJson(input, transformationRules);
  console.assert(deepEqual(result, expected), 
    `Test failed: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
}

// Test Case 3: Test "format" transformation
function testFormat() {
  const input = {
    product: {
      name: "smartphone",
      price: 999.9999,
      releaseDate: "03/15/2023"
    }
  };

  const transformationRules = [
    { type: "format", field: "product.name", formatType: "uppercase" },
    { type: "format", field: "product.price", formatType: "number" },
    { type: "format", field: "product.releaseDate", formatType: "date" }
  ];

  const expected = {
    product: {
      name: "SMARTPHONE",
      price: 1000.00, // Rounded to 2 decimal places
      releaseDate: "2023-03-15"
    }
  };

  const result = transformJson(input, transformationRules);
  console.assert(deepEqual(result, expected), 
    `Test failed: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
}

// Test Case 4: Test "restructure" transformation
function testRestructure() {
  const input = {
    name: "John",
    email: "john@example.com",
    age: 25,
    city: "San Francisco"
  };

  const transformationRules = [
    { type: "restructure", from: "name", to: "user.personal.fullName" },
    { type: "restructure", from: "email", to: "user.contact.email" },
    { type: "restructure", from: "age", to: "user.personal.age" },
    { type: "restructure", from: "city", to: "user.address.city" }
  ];

  const expected = {
    user: {
      personal: {
        fullName: "John",
        age: 25
      },
      contact: {
        email: "john@example.com"
      },
      address: {
        city: "San Francisco"
      }
    }
  };

  const result = transformJson(input, transformationRules);
  console.assert(deepEqual(result, expected), 
    `Test failed: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
}

// Test Case 5: Test "filter" transformation with different operators
function testFilter() {
  const input = {
    products: [
      { id: 1, name: "Laptop", price: 1200, inStock: true },
      { id: 2, name: "Phone", price: 800, inStock: true },
      { id: 3, name: "Tablet", price: 300, inStock: false },
      { id: 4, name: "Smartwatch", price: 250, inStock: true }
    ]
  };

  const transformationRules = [
    // Filter products with price > 500
    { 
      type: "filter", 
      field: "products", 
      condition: { field: "price", operator: "gt", value: 500 } 
    },
    // Then filter for products in stock
    { 
      type: "filter", 
      field: "products", 
      condition: { field: "inStock", operator: "eq", value: true } 
    }
  ];

  const expected = {
    products: [
      { id: 1, name: "Laptop", price: 1200, inStock: true },
      { id: 2, name: "Phone", price: 800, inStock: true }
    ]
  };

  const result = transformJson(input, transformationRules);
  console.assert(deepEqual(result, expected), 
    `Test failed: Expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
}

// Test Case 6: Test "calculate" transformation with different operations
function testCalculate() {
  const input = {
    students: [
      { name: "Alice", scores: [85, 90, 92] },
      { name: "Bob", scores: [75, 80, 85] },
      { name: "Charlie", scores: [95, 88, 91] }
    ]
  };

  // First, transform the data to have average scores
  const preprocessRules = [
    {
      type: "calculate",
      targetField: "students.0.averageScore",
      operation: "average",
      sourceField: "students.0.scores"
    },
    {
      type: "calculate",
      targetField: "students.1.averageScore",
      operation: "average",
      sourceField: "students.1.scores"
    },
    {
      type: "calculate",
      targetField: "students.2.averageScore",
      operation: "average",
      sourceField: "students.2.scores"
    }
  ];
  
  // Then, calculate class statistics
  const transformationRules = [
    {
      type: "calculate",
      targetField: "classStats.highestAverage",
      operation: "max",
      sourceField: "students",
      valueField: "averageScore"
    },
    {
      type: "calculate",
      targetField: "classStats.lowestAverage",
      operation: "min",
      sourceField: "students",
      valueField: "averageScore"
    },
    {
      type: "calculate",
      targetField: "classStats.averageOfAverages",
      operation: "average",
      sourceField: "students",
      valueField: "averageScore"
    }
  ];

  // Apply preprocessing rules first
  let intermediate = transformJson(input, preprocessRules);
  
  // Then apply the main transformation rules
  const result = transformJson(intermediate, transformationRules);
  
  // Calculate expected values manually
  const aliceAvg = (85 + 90 + 92) / 3;
  const bobAvg = (75 + 80 + 85) / 3;
  const charlieAvg = (95 + 88 + 91) / 3;
  
  const highest = Math.max(aliceAvg, bobAvg, charlieAvg);
  const lowest = Math.min(aliceAvg, bobAvg, charlieAvg);
  const avg = (aliceAvg + bobAvg + charlieAvg) / 3;
  
  // Check that the class stats are calculated correctly
  console.assert(Math.abs(result.classStats.highestAverage - highest) < 0.01, 
    `Highest average incorrect: Expected ${highest}, got ${result.classStats.highestAverage}`);
  
  console.assert(Math.abs(result.classStats.lowestAverage - lowest) < 0.01, 
    `Lowest average incorrect: Expected ${lowest}, got ${result.classStats.lowestAverage}`);
  
  console.assert(Math.abs(result.classStats.averageOfAverages - avg) < 0.01, 
    `Average of averages incorrect: Expected ${avg}, got ${result.classStats.averageOfAverages}`);
}

// Run all tests
console.log("Running tests...");
testExample();
testRename();
testFormat();
testRestructure();
testFilter();
testCalculate();
console.log("All tests completed!");

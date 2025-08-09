const { allocateInventory } = require('./inventory');

// Helper function to validate allocation
function validateAllocation(order, warehouses, result) {
  // Check that all items are allocated
  const orderTotals = {};
  for (const item of order.items) {
    orderTotals[item.productId] = (orderTotals[item.productId] || 0) + item.quantity;
  }

  const allocationTotals = {};
  for (const allocation of result.allocations) {
    for (const item of allocation.items) {
      allocationTotals[item.productId] = (allocationTotals[item.productId] || 0) + item.quantity;
    }
  }

  for (const productId in orderTotals) {
    if (orderTotals[productId] !== allocationTotals[productId]) {
      return false;
    }
  }

  // Check that warehouse inventory is not exceeded
  const warehouseAllocations = {};
  for (const allocation of result.allocations) {
    warehouseAllocations[allocation.warehouseId] = warehouseAllocations[allocation.warehouseId] || {};
    for (const item of allocation.items) {
      warehouseAllocations[allocation.warehouseId][item.productId] =
        (warehouseAllocations[allocation.warehouseId][item.productId] || 0) + item.quantity;
    }
  }

  for (const warehouse of warehouses) {
    if (!warehouseAllocations[warehouse.id]) continue;
    for (const productId in warehouseAllocations[warehouse.id]) {
      if (warehouseAllocations[warehouse.id][productId] > (warehouse.inventory[productId] || 0)) {
        return false;
      }
    }
  }

  return true;
}

// Helper function to calculate the total cost
function calculateTotalCost(order, warehouses, allocations) {
  let totalCost = 0;
  for (const allocation of allocations) {
    const warehouse = warehouses.find(w => w.id === allocation.warehouseId);
    const shippingCost = warehouse.shippingCosts[order.region];
    for (const item of allocation.items) {
      totalCost += item.quantity * shippingCost;
    }
  }
  return totalCost;
}

// Test Case 1: Example from the README
function testExample() {
  const order = {
    customerId: 123,
    region: 'East',
    items: [
      { productId: 'P1', quantity: 5 },
      { productId: 'P2', quantity: 3 },
    ],
  };

  const warehouses = [
    {
      id: 'W1',
      name: 'Warehouse 1',
      inventory: { P1: 3, P2: 2, P3: 10 },
      shippingCosts: { East: 5, West: 10, Central: 7 },
    },
    {
      id: 'W2',
      name: 'Warehouse 2',
      inventory: { P1: 4, P2: 5, P4: 8 },
      shippingCosts: { East: 6, West: 8, Central: 5 },
    },
    {
      id: 'W3',
      name: 'Warehouse 3',
      inventory: { P1: 2, P3: 4, P4: 3 },
      shippingCosts: { East: 8, West: 6, Central: 9 },
    },
  ];

  const result = allocateInventory(order, warehouses);

  // Validate the allocation
  const isValid = validateAllocation(order, warehouses, result);
  console.assert(isValid, 'The allocation does not fulfill the order or exceeds warehouse inventory');

  // Check that the reported total cost matches the actual cost
  const actualCost = calculateTotalCost(order, warehouses, result.allocations);
  console.assert(
    Math.abs(result.totalCost - actualCost) < 0.001,
    `Reported cost ${result.totalCost} does not match actual cost ${actualCost}`
  );

  // The optimal allocation for this example costs 39
  console.assert(result.totalCost <= 39, `Expected cost to be at most 39, got ${result.totalCost}`);
}

// Test Case 2: Single warehouse has all inventory
function testSingleWarehouse() {
  const order = {
    customerId: 123,
    region: 'West',
    items: [
      { productId: 'P1', quantity: 2 },
      { productId: 'P2', quantity: 3 },
    ],
  };

  const warehouses = [
    {
      id: 'W1',
      name: 'Warehouse 1',
      inventory: { P1: 5, P2: 5 },
      shippingCosts: { East: 5, West: 4, Central: 6 },
    },
    {
      id: 'W2',
      name: 'Warehouse 2',
      inventory: { P1: 0, P2: 1 },
      shippingCosts: { East: 3, West: 2, Central: 5 },
    },
  ];

  const result = allocateInventory(order, warehouses);

  // Validate the allocation
  const isValid = validateAllocation(order, warehouses, result);
  console.assert(isValid, 'The allocation does not fulfill the order or exceeds warehouse inventory');

  // Check that all items are allocated from W1 (which has the lowest total cost)
  console.assert(result.allocations.length === 1, `Expected 1 allocation, got ${result.allocations.length}`);
  console.assert(
    result.allocations[0].warehouseId === 'W1',
    `Expected allocation from W1, got ${result.allocations[0].warehouseId}`
  );

  // The optimal cost is 2 items from W1 at $4 each plus 3 items from W1 at $4 each = $20
  console.assert(result.totalCost === 20, `Expected cost to be 20, got ${result.totalCost}`);
}

// Test Case 3: Split allocation required (not enough inventory in one warehouse)
function testSplitAllocation() {
  const order = {
    customerId: 123,
    region: 'Central',
    items: [{ productId: 'P1', quantity: 5 }],
  };

  const warehouses = [
    {
      id: 'W1',
      name: 'Warehouse 1',
      inventory: { P1: 3 },
      shippingCosts: { East: 5, West: 4, Central: 3 },
    },
    {
      id: 'W2',
      name: 'Warehouse 2',
      inventory: { P1: 2 },
      shippingCosts: { East: 6, West: 5, Central: 4 },
    },
  ];

  const result = allocateInventory(order, warehouses);

  // Validate the allocation
  const isValid = validateAllocation(order, warehouses, result);
  console.assert(isValid, 'The allocation does not fulfill the order or exceeds warehouse inventory');

  // Check that the allocation is split correctly
  console.assert(result.allocations.length === 2, `Expected 2 allocations, got ${result.allocations.length}`);

  // The optimal allocation is 3 from W1 at $3 each and 2 from W2 at $4 each = $17
  console.assert(result.totalCost === 17, `Expected cost to be 17, got ${result.totalCost}`);
}

// Test Case 4: Multiple items with different optimal warehouses
function testMultipleItems() {
  const order = {
    customerId: 123,
    region: 'East',
    items: [
      { productId: 'P1', quantity: 2 },
      { productId: 'P2', quantity: 3 },
      { productId: 'P3', quantity: 1 },
    ],
  };

  const warehouses = [
    {
      id: 'W1',
      name: 'Warehouse 1',
      inventory: { P1: 2, P2: 0, P3: 1 },
      shippingCosts: { East: 3, West: 5, Central: 4 },
    },
    {
      id: 'W2',
      name: 'Warehouse 2',
      inventory: { P1: 1, P2: 3, P3: 0 },
      shippingCosts: { East: 4, West: 3, Central: 5 },
    },
  ];

  const result = allocateInventory(order, warehouses);

  // Validate the allocation
  const isValid = validateAllocation(order, warehouses, result);
  console.assert(isValid, 'The allocation does not fulfill the order or exceeds warehouse inventory');

  // The optimal allocation is:
  // P1: 2 from W1 at $3 each = $6
  // P2: 3 from W2 at $4 each = $12
  // P3: 1 from W1 at $3 each = $3
  // Total = $21
  console.assert(result.totalCost === 21, `Expected cost to be 21, got ${result.totalCost}`);
}

// Test Case 5: Equal shipping costs, any valid allocation is acceptable
function testEqualCosts() {
  const order = {
    customerId: 123,
    region: 'East',
    items: [{ productId: 'P1', quantity: 3 }],
  };

  const warehouses = [
    {
      id: 'W1',
      name: 'Warehouse 1',
      inventory: { P1: 2 },
      shippingCosts: { East: 5, West: 6, Central: 7 },
    },
    {
      id: 'W2',
      name: 'Warehouse 2',
      inventory: { P1: 2 },
      shippingCosts: { East: 5, West: 6, Central: 7 },
    },
  ];

  const result = allocateInventory(order, warehouses);

  // Validate the allocation
  const isValid = validateAllocation(order, warehouses, result);
  console.assert(isValid, 'The allocation does not fulfill the order or exceeds warehouse inventory');

  // The total cost should be 5 * 3 = 15
  console.assert(result.totalCost === 15, `Expected cost to be 15, got ${result.totalCost}`);
}

// Simple test runner with failure reporting
function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ ${name} passed`);
    return true;
  } catch (err) {
    console.error(`❌ ${name} failed: ${err.message}`);
    return false;
  }
}

console.log('Running tests...');
const results = [
  runTest('Test Case 1: Example from the README', testExample),
  runTest('Test Case 2: Single warehouse has all inventory', testSingleWarehouse),
  runTest('Test Case 3: Split allocation required', testSplitAllocation),
  runTest('Test Case 4: Multiple items with different optimal warehouses', testMultipleItems),
  runTest('Test Case 5: Equal shipping costs, any valid allocation is acceptable', testEqualCosts),
];

const failed = results.filter(r => !r).length;
if (failed > 0) {
  console.error(`${failed} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('All tests passed.');
}



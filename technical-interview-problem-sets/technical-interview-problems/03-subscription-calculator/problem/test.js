const { calculateSubscriptionCosts } = require('./subscription');

// Helper function to round to 2 decimal places for money
function roundToMoney(value) {
  return Math.round(value * 100) / 100;
}

// Test Case 1: Basic test with the example from the README
function testBasicExample() {
  const employees = [
    { id: 1, name: "Alice", startDate: "2023-01-15" },
    { id: 2, name: "Bob", startDate: "2023-02-01", endDate: "2023-05-15" },
    { id: 3, name: "Charlie", startDate: "2023-03-10" }
  ];

  const pricingChanges = [
    { date: "2023-01-01", pricePerSeat: 50 },
    { date: "2023-04-01", pricePerSeat: 75 }
  ];

  const endDate = "2023-06-30";

  const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
  
  // Check that total cost is approximately correct (allowing for small rounding differences)
  console.assert(Math.abs(result.totalCost - 775) < 1, 
    `Expected total cost around 775, got ${result.totalCost}`);
  
  // Check a few key monthly costs
  console.assert(Math.abs(result.monthlyCosts["2023-01"] - 25.81) < 0.1, 
    `Expected January cost around 25.81, got ${result.monthlyCosts["2023-01"]}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-02"] - 100) < 0.1, 
    `Expected February cost around 100, got ${result.monthlyCosts["2023-02"]}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-06"] - 100) < 0.1, 
    `Expected June cost around 100, got ${result.monthlyCosts["2023-06"]}`);
  
  // Check that all months are accounted for
  const expectedMonths = ["2023-01", "2023-02", "2023-03", "2023-04", "2023-05", "2023-06"];
  for (const month of expectedMonths) {
    console.assert(month in result.monthlyCosts, `Missing month ${month} in monthlyCosts`);
  }
}

// Test Case 2: Single employee for a full month
function testSingleEmployeeFullMonth() {
  const employees = [
    { id: 1, name: "Alice", startDate: "2023-01-01" }
  ];

  const pricingChanges = [
    { date: "2023-01-01", pricePerSeat: 50 }
  ];

  const endDate = "2023-01-31";

  const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
  
  console.assert(Math.abs(result.totalCost - 50) < 0.1, 
    `Expected total cost 50, got ${result.totalCost}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-01"] - 50) < 0.1, 
    `Expected January cost 50, got ${result.monthlyCosts["2023-01"]}`);
}

// Test Case 3: Pricing change within a month
function testPricingChangeWithinMonth() {
  const employees = [
    { id: 1, name: "Alice", startDate: "2023-01-01" },
    { id: 2, name: "Bob", startDate: "2023-01-15" }
  ];

  const pricingChanges = [
    { date: "2023-01-01", pricePerSeat: 50 },
    { date: "2023-01-10", pricePerSeat: 75 }
  ];

  const endDate = "2023-01-31";

  const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
  
  // Alice pays 50 for the whole month (grandfathered)
  // Bob pays 75 from 15th to 31st (17 days out of 31)
  const expectedBobCost = 75 * (17 / 31);
  const expectedTotal = 50 + expectedBobCost;
  
  console.assert(Math.abs(result.totalCost - expectedTotal) < 0.1, 
    `Expected total cost ${expectedTotal}, got ${result.totalCost}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-01"] - expectedTotal) < 0.1, 
    `Expected January cost ${expectedTotal}, got ${result.monthlyCosts["2023-01"]}`);
}

// Test Case 4: Employee leaving in the middle of the month
function testEmployeeLeavingMidMonth() {
  const employees = [
    { id: 1, name: "Alice", startDate: "2023-01-01", endDate: "2023-01-15" }
  ];

  const pricingChanges = [
    { date: "2023-01-01", pricePerSeat: 50 }
  ];

  const endDate = "2023-01-31";

  const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
  
  // Alice pays 50 * (15 / 31) ≈ 24.19
  const expectedCost = roundToMoney(50 * (15 / 31));
  
  console.assert(Math.abs(result.totalCost - expectedCost) < 0.1, 
    `Expected total cost ${expectedCost}, got ${result.totalCost}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-01"] - expectedCost) < 0.1, 
    `Expected January cost ${expectedCost}, got ${result.monthlyCosts["2023-01"]}`);
}

// Test Case 5: Multiple employees with different start and end dates
function testMultipleEmployeesVariousDates() {
  const employees = [
    { id: 1, name: "Alice", startDate: "2023-01-10", endDate: "2023-02-20" },
    { id: 2, name: "Bob", startDate: "2023-01-15" },
    { id: 3, name: "Charlie", startDate: "2023-02-05", endDate: "2023-02-25" }
  ];

  const pricingChanges = [
    { date: "2023-01-01", pricePerSeat: 50 },
    { date: "2023-02-01", pricePerSeat: 60 }
  ];

  const endDate = "2023-02-28";

  const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
  
  // Calculate expected costs manually for validation
  // January: Alice (22/31 days) + Bob (17/31 days) at $50 each
  const januaryCost = roundToMoney(50 * (22/31) + 50 * (17/31));
  
  // February: 
  // - Alice (20/28 days) at $50 (grandfathered)
  // - Bob (28/28 days) at $50 (grandfathered)
  // - Charlie (21/28 days) at $60 (new pricing)
  const februaryCost = roundToMoney(50 * (20/28) + 50 + 60 * (21/28));
  
  const expectedTotal = roundToMoney(januaryCost + februaryCost);
  
  console.assert(Math.abs(result.totalCost - expectedTotal) < 0.1, 
    `Expected total cost ${expectedTotal}, got ${result.totalCost}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-01"] - januaryCost) < 0.1, 
    `Expected January cost ${januaryCost}, got ${result.monthlyCosts["2023-01"]}`);
  
  console.assert(Math.abs(result.monthlyCosts["2023-02"] - februaryCost) < 0.1, 
    `Expected February cost ${februaryCost}, got ${result.monthlyCosts["2023-02"]}`);
}

// Run all tests
console.log("Running tests...");
testBasicExample();
testSingleEmployeeFullMonth();
testPricingChangeWithinMonth();
testEmployeeLeavingMidMonth();
testMultipleEmployeesVariousDates();
console.log("All tests completed!");

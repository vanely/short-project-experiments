const { findMostAffordablePlan } = require('./insurance');

// Test Case 1: Basic test with the example from the README
function testBasicExample() {
  const preferredProviders = [
    { providerId: "p1", name: "Dr. Smith" },
    { providerId: "p2", name: "Dr. Johnson" },
    { providerId: "p3", name: "Dr. Williams" }
  ];

  const availableProviders = [
    { providerId: "p1", name: "Dr. Smith", networks: ["n1", "n2"] },
    { providerId: "p2", name: "Dr. Johnson", networks: ["n2", "n3"] },
    { providerId: "p3", name: "Dr. Williams", networks: ["n3"] },
    { providerId: "p4", name: "Dr. Brown", networks: ["n1", "n4"] }
  ];

  const insurancePlans = [
    { planId: "plan1", name: "Basic Plan", monthlyCost: 100, networks: ["n1"] },
    { planId: "plan2", name: "Standard Plan", monthlyCost: 150, networks: ["n1", "n2"] },
    { planId: "plan3", name: "Premium Plan", monthlyCost: 200, networks: ["n1", "n2", "n3"] },
    { planId: "plan4", name: "Elite Plan", monthlyCost: 300, networks: ["n1", "n2", "n3", "n4"] }
  ];

  const result = findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans);
  console.assert(result.planId === "plan3", 
    `Expected Premium Plan (plan3) but got ${result ? result.name : 'null'}`);
}

// Test Case 2: Multiple plans with same coverage, should return cheapest
function testCheapestWithSameCoverage() {
  const preferredProviders = [
    { providerId: "p1", name: "Dr. Smith" },
    { providerId: "p2", name: "Dr. Johnson" }
  ];

  const availableProviders = [
    { providerId: "p1", name: "Dr. Smith", networks: ["n1"] },
    { providerId: "p2", name: "Dr. Johnson", networks: ["n1"] }
  ];

  const insurancePlans = [
    { planId: "plan1", name: "Basic Plan", monthlyCost: 100, networks: ["n1"] },
    { planId: "plan2", name: "Standard Plan", monthlyCost: 150, networks: ["n1"] }
  ];

  const result = findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans);
  console.assert(result.planId === "plan1", 
    `Expected Basic Plan (plan1) but got ${result ? result.name : 'null'}`);
}

// Test Case 3: No coverage for preferred providers
function testNoCoverage() {
  const preferredProviders = [
    { providerId: "p1", name: "Dr. Smith" }
  ];

  const availableProviders = [
    { providerId: "p1", name: "Dr. Smith", networks: ["n1"] }
  ];

  const insurancePlans = [
    { planId: "plan1", name: "Basic Plan", monthlyCost: 100, networks: ["n2"] }
  ];

  const result = findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans);
  console.assert(result === null, 
    `Expected null but got ${result ? result.name : 'null'}`);
}

// Test Case 4: Different plans with different coverage levels
function testDifferentCoverageLevels() {
  const preferredProviders = [
    { providerId: "p1", name: "Dr. Smith" },
    { providerId: "p2", name: "Dr. Johnson" },
    { providerId: "p3", name: "Dr. Williams" }
  ];

  const availableProviders = [
    { providerId: "p1", name: "Dr. Smith", networks: ["n1"] },
    { providerId: "p2", name: "Dr. Johnson", networks: ["n2"] },
    { providerId: "p3", name: "Dr. Williams", networks: ["n3"] }
  ];

  const insurancePlans = [
    { planId: "plan1", name: "Basic Plan", monthlyCost: 100, networks: ["n1"] },
    { planId: "plan2", name: "Standard Plan", monthlyCost: 150, networks: ["n1", "n2"] },
    { planId: "plan3", name: "Premium Plan", monthlyCost: 200, networks: ["n1", "n2", "n3"] }
  ];

  const result = findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans);
  console.assert(result.planId === "plan3", 
    `Expected Premium Plan (plan3) but got ${result ? result.name : 'null'}`);
}

// Test Case 5: Equal cost and coverage, any can be returned
function testEqualCostAndCoverage() {
  const preferredProviders = [
    { providerId: "p1", name: "Dr. Smith" }
  ];

  const availableProviders = [
    { providerId: "p1", name: "Dr. Smith", networks: ["n1", "n2"] }
  ];

  const insurancePlans = [
    { planId: "plan1", name: "Basic Plan A", monthlyCost: 100, networks: ["n1"] },
    { planId: "plan2", name: "Basic Plan B", monthlyCost: 100, networks: ["n2"] }
  ];

  const result = findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans);
  console.assert(result !== null && (result.planId === "plan1" || result.planId === "plan2"), 
    `Expected either Basic Plan A or B but got ${result ? result.name : 'null'}`);
}

// Run all tests
console.log("Running tests...");
testBasicExample();
testCheapestWithSameCoverage();
testNoCoverage();
testDifferentCoverageLevels();
testEqualCostAndCoverage();
console.log("All tests completed!");

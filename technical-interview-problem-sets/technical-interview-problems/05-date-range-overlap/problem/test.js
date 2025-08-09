const { findDateRangeOverlaps } = require('./dateRange');

// Test Case 1: Example from the README
function testExample() {
  const dateRanges = [
    { id: 1, start: "2023-01-15", end: "2023-01-20", title: "Team Offsite" },
    { id: 2, start: "2023-01-18", end: "2023-01-25", title: "Product Launch" },
    { id: 3, start: "2023-01-26", end: "2023-01-31", title: "Marketing Campaign" },
    { id: 4, start: "2023-01-10", end: "2023-01-16", title: "Budget Planning" }
  ];

  const result = findDateRangeOverlaps(dateRanges);
  
  console.assert(result.length === 2, `Expected 2 overlaps, got ${result.length}`);
  
  // First overlap: Team Offsite and Product Launch
  const overlap1 = result.find(o => 
    (o.range1Id === 1 && o.range2Id === 2) || 
    (o.range1Id === 2 && o.range2Id === 1)
  );
  
  console.assert(overlap1, "Expected to find overlap between Team Offsite and Product Launch");
  console.assert(overlap1.overlapStart === "2023-01-18", 
    `Expected overlap to start on 2023-01-18, got ${overlap1.overlapStart}`);
  console.assert(overlap1.overlapEnd === "2023-01-20", 
    `Expected overlap to end on 2023-01-20, got ${overlap1.overlapEnd}`);
  console.assert(overlap1.overlapDays === 3, 
    `Expected 3 days of overlap, got ${overlap1.overlapDays}`);
  
  // Second overlap: Team Offsite and Budget Planning
  const overlap2 = result.find(o => 
    (o.range1Id === 1 && o.range2Id === 4) || 
    (o.range1Id === 4 && o.range2Id === 1)
  );
  
  console.assert(overlap2, "Expected to find overlap between Team Offsite and Budget Planning");
  console.assert(overlap2.overlapStart === "2023-01-15", 
    `Expected overlap to start on 2023-01-15, got ${overlap2.overlapStart}`);
  console.assert(overlap2.overlapEnd === "2023-01-16", 
    `Expected overlap to end on 2023-01-16, got ${overlap2.overlapEnd}`);
  console.assert(overlap2.overlapDays === 2, 
    `Expected 2 days of overlap, got ${overlap2.overlapDays}`);
}

// Test Case 2: No overlaps
function testNoOverlaps() {
  const dateRanges = [
    { id: 1, start: "2023-01-01", end: "2023-01-05" },
    { id: 2, start: "2023-01-06", end: "2023-01-10" },
    { id: 3, start: "2023-01-11", end: "2023-01-15" }
  ];

  const result = findDateRangeOverlaps(dateRanges);
  console.assert(result.length === 0, `Expected 0 overlaps, got ${result.length}`);
}

// Test Case 3: Adjacent dates (no overlap)
function testAdjacentDates() {
  const dateRanges = [
    { id: 1, start: "2023-01-01", end: "2023-01-05" },
    { id: 2, start: "2023-01-05", end: "2023-01-10" } // End of range 1 is start of range 2
  ];

  const result = findDateRangeOverlaps(dateRanges);
  
  // This is a borderline case. We consider dates to be inclusive,
  // so if one range ends on the same day another starts, they do overlap.
  console.assert(result.length === 1, `Expected 1 overlap, got ${result.length}`);
  
  if (result.length === 1) {
    console.assert(result[0].overlapStart === "2023-01-05", 
      `Expected overlap to start on 2023-01-05, got ${result[0].overlapStart}`);
    console.assert(result[0].overlapEnd === "2023-01-05", 
      `Expected overlap to end on 2023-01-05, got ${result[0].overlapEnd}`);
    console.assert(result[0].overlapDays === 1, 
      `Expected 1 day of overlap, got ${result[0].overlapDays}`);
  }
}

// Test Case 4: Complete containment
function testContainment() {
  const dateRanges = [
    { id: 1, start: "2023-01-01", end: "2023-01-31" },
    { id: 2, start: "2023-01-10", end: "2023-01-20" } // Completely contained within range 1
  ];

  const result = findDateRangeOverlaps(dateRanges);
  console.assert(result.length === 1, `Expected 1 overlap, got ${result.length}`);
  
  if (result.length === 1) {
    console.assert(result[0].overlapStart === "2023-01-10", 
      `Expected overlap to start on 2023-01-10, got ${result[0].overlapStart}`);
    console.assert(result[0].overlapEnd === "2023-01-20", 
      `Expected overlap to end on 2023-01-20, got ${result[0].overlapEnd}`);
    console.assert(result[0].overlapDays === 11, 
      `Expected 11 days of overlap, got ${result[0].overlapDays}`);
  }
}

// Test Case 5: Multiple overlaps
function testMultipleOverlaps() {
  const dateRanges = [
    { id: 1, start: "2023-01-01", end: "2023-01-15" },
    { id: 2, start: "2023-01-10", end: "2023-01-25" },
    { id: 3, start: "2023-01-20", end: "2023-01-30" }
  ];

  const result = findDateRangeOverlaps(dateRanges);
  
  // Each range overlaps with each other range, so we expect 3 overlaps
  console.assert(result.length === 3, `Expected 3 overlaps, got ${result.length}`);
  
  // Check that all pairs are present
  const pairs = result.map(o => `${o.range1Id}-${o.range2Id}`);
  console.assert(pairs.includes("1-2"), "Expected to find overlap between ranges 1 and 2");
  console.assert(pairs.includes("1-3") || pairs.includes("3-1"), 
    "Expected to find overlap between ranges 1 and 3");
  console.assert(pairs.includes("2-3"), "Expected to find overlap between ranges 2 and 3");
  
  // Verify one of the overlaps in detail
  const overlap12 = result.find(o => 
    (o.range1Id === 1 && o.range2Id === 2) || 
    (o.range1Id === 2 && o.range2Id === 1)
  );
  
  if (overlap12) {
    console.assert(overlap12.overlapStart === "2023-01-10", 
      `Expected overlap to start on 2023-01-10, got ${overlap12.overlapStart}`);
    console.assert(overlap12.overlapEnd === "2023-01-15", 
      `Expected overlap to end on 2023-01-15, got ${overlap12.overlapEnd}`);
    console.assert(overlap12.overlapDays === 6, 
      `Expected 6 days of overlap, got ${overlap12.overlapDays}`);
  }
}

// Test Case 6: Same start or end date
function testSameStartOrEndDate() {
  const dateRanges = [
    { id: 1, start: "2023-01-01", end: "2023-01-10" },
    { id: 2, start: "2023-01-01", end: "2023-01-05" }, // Same start date as range 1
    { id: 3, start: "2023-01-15", end: "2023-01-20" },
    { id: 4, start: "2023-01-12", end: "2023-01-15" }  // Same end date as range 3
  ];

  const result = findDateRangeOverlaps(dateRanges);
  console.assert(result.length === 2, `Expected 2 overlaps, got ${result.length}`);
  
  // Check the overlaps between ranges with the same start date
  const overlap12 = result.find(o => 
    (o.range1Id === 1 && o.range2Id === 2) || 
    (o.range1Id === 2 && o.range2Id === 1)
  );
  
  if (overlap12) {
    console.assert(overlap12.overlapStart === "2023-01-01", 
      `Expected overlap to start on 2023-01-01, got ${overlap12.overlapStart}`);
    console.assert(overlap12.overlapEnd === "2023-01-05", 
      `Expected overlap to end on 2023-01-05, got ${overlap12.overlapEnd}`);
    console.assert(overlap12.overlapDays === 5, 
      `Expected 5 days of overlap, got ${overlap12.overlapDays}`);
  }
  
  // Check the overlaps between ranges with the same end date
  const overlap34 = result.find(o => 
    (o.range1Id === 3 && o.range2Id === 4) || 
    (o.range1Id === 4 && o.range2Id === 3)
  );
  
  if (overlap34) {
    console.assert(overlap34.overlapStart === "2023-01-15", 
      `Expected overlap to start on 2023-01-15, got ${overlap34.overlapStart}`);
    console.assert(overlap34.overlapEnd === "2023-01-15", 
      `Expected overlap to end on 2023-01-15, got ${overlap34.overlapEnd}`);
    console.assert(overlap34.overlapDays === 1, 
      `Expected 1 day of overlap, got ${overlap34.overlapDays}`);
  }
}

// Run all tests
console.log("Running tests...");
testExample();
testNoOverlaps();
testAdjacentDates();
testContainment();
testMultipleOverlaps();
testSameStartOrEndDate();
console.log("All tests completed!");

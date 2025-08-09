const { analyzeNetworkLatency } = require('./network');

// Sample latency data for tests
const sampleLatencyData = [
  { source: "service-a", destination: "service-b", timestamp: "2023-01-01T12:00:00Z", latencyMs: 50 },
  { source: "service-a", destination: "service-b", timestamp: "2023-01-01T12:05:00Z", latencyMs: 60 },
  { source: "service-b", destination: "service-c", timestamp: "2023-01-01T12:02:00Z", latencyMs: 20 },
  { source: "service-a", destination: "service-c", timestamp: "2023-01-01T12:03:00Z", latencyMs: 40 },
  { source: "service-c", destination: "service-d", timestamp: "2023-01-01T12:04:00Z", latencyMs: 30 },
  { source: "service-b", destination: "service-d", timestamp: "2023-01-01T12:06:00Z", latencyMs: 70 },
  { source: "service-a", destination: "service-d", timestamp: "2023-01-01T12:07:00Z", latencyMs: 90 }
];

// Test Case 1: Test all request types with the example from the README
function testExample() {
  const requests = [
    {
      type: "average_latency",
      source: "service-a",
      destination: "service-b"
    },
    {
      type: "percentile_latency",
      percentile: 90,
      source: "service-a"
    },
    {
      type: "service_ranking",
      metric: "latency",
      order: "asc",
      limit: 3
    },
    {
      type: "path_analysis",
      source: "service-a",
      destination: "service-d",
      maxHops: 2
    }
  ];

  const results = analyzeNetworkLatency(sampleLatencyData, requests);
  
  // Check average_latency result
  console.assert(
    Math.abs(results[0].averageLatency - 55) < 0.1,
    `Expected average latency to be around 55, got ${results[0].averageLatency}`
  );
  
  // Check percentile_latency result
  console.assert(
    Math.abs(results[1].percentileLatency - 90) < 0.1,
    `Expected 90th percentile latency to be around 90, got ${results[1].percentileLatency}`
  );
  
  // Check service_ranking result
  console.assert(
    results[2].rankings.length === 3,
    `Expected 3 services in ranking, got ${results[2].rankings.length}`
  );
  
  const expectedServices = ["service-c", "service-b", "service-a"];
  const actualServices = results[2].rankings.map(r => r.service);
  
  for (let i = 0; i < expectedServices.length; i++) {
    console.assert(
      actualServices.includes(expectedServices[i]),
      `Expected service ${expectedServices[i]} to be in rankings`
    );
  }
  
  // Check path_analysis result
  console.assert(
    results[3].paths.length === 3,
    `Expected 3 paths, got ${results[3].paths.length}`
  );
  
  // Check for direct path
  const directPath = results[3].paths.find(p => 
    p.route.length === 2 && 
    p.route[0] === "service-a" && 
    p.route[1] === "service-d"
  );
  
  console.assert(
    directPath && Math.abs(directPath.totalLatency - 90) < 0.1,
    `Expected direct path with latency around 90, got ${directPath ? directPath.totalLatency : 'no direct path'}`
  );
}

// Test Case 2: Test average_latency with various filter combinations
function testAverageLatency() {
  const requests = [
    {
      // Test with specific source and destination
      type: "average_latency",
      source: "service-a",
      destination: "service-b"
    },
    {
      // Test with specific source only
      type: "average_latency",
      source: "service-a"
    },
    {
      // Test with specific destination only
      type: "average_latency",
      destination: "service-d"
    },
    {
      // Test with time range
      type: "average_latency",
      timeRange: {
        start: "2023-01-01T12:04:00Z",
        end: "2023-01-01T12:08:00Z"
      }
    }
  ];

  const results = analyzeNetworkLatency(sampleLatencyData, requests);
  
  // Check specific source and destination
  console.assert(
    Math.abs(results[0].averageLatency - 55) < 0.1,
    `Expected average latency from service-a to service-b to be around 55, got ${results[0].averageLatency}`
  );
  
  // Check specific source only (should average all outgoing latencies from service-a)
  const sourceALatencies = [50, 60, 40, 90];
  const expectedSourceAAvg = sourceALatencies.reduce((sum, val) => sum + val, 0) / sourceALatencies.length;
  
  console.assert(
    Math.abs(results[1].averageLatency - expectedSourceAAvg) < 0.1,
    `Expected average latency from service-a to be around ${expectedSourceAAvg}, got ${results[1].averageLatency}`
  );
  
  // Check specific destination only (should average all incoming latencies to service-d)
  const destDLatencies = [30, 70, 90];
  const expectedDestDAvg = destDLatencies.reduce((sum, val) => sum + val, 0) / destDLatencies.length;
  
  console.assert(
    Math.abs(results[2].averageLatency - expectedDestDAvg) < 0.1,
    `Expected average latency to service-d to be around ${expectedDestDAvg}, got ${results[2].averageLatency}`
  );
  
  // Check time range filter
  const timeRangeLatencies = [60, 70, 90];
  const expectedTimeRangeAvg = timeRangeLatencies.reduce((sum, val) => sum + val, 0) / timeRangeLatencies.length;
  
  console.assert(
    Math.abs(results[3].averageLatency - expectedTimeRangeAvg) < 0.1,
    `Expected average latency in time range to be around ${expectedTimeRangeAvg}, got ${results[3].averageLatency}`
  );
}

// Test Case 3: Test percentile_latency calculation
function testPercentileLatency() {
  const requests = [
    {
      type: "percentile_latency",
      percentile: 50 // median
    },
    {
      type: "percentile_latency",
      percentile: 0 // minimum
    },
    {
      type: "percentile_latency",
      percentile: 100 // maximum
    }
  ];

  const results = analyzeNetworkLatency(sampleLatencyData, requests);
  
  // Sort all latencies to check percentiles
  const allLatencies = sampleLatencyData.map(d => d.latencyMs).sort((a, b) => a - b);
  
  // Check 50th percentile (median)
  const medianIndex = Math.floor(allLatencies.length / 2);
  const expectedMedian = allLatencies[medianIndex];
  
  console.assert(
    results[0].percentileLatency === expectedMedian,
    `Expected 50th percentile to be ${expectedMedian}, got ${results[0].percentileLatency}`
  );
  
  // Check 0th percentile (minimum)
  console.assert(
    results[1].percentileLatency === allLatencies[0],
    `Expected 0th percentile to be ${allLatencies[0]}, got ${results[1].percentileLatency}`
  );
  
  // Check 100th percentile (maximum)
  console.assert(
    results[2].percentileLatency === allLatencies[allLatencies.length - 1],
    `Expected 100th percentile to be ${allLatencies[allLatencies.length - 1]}, got ${results[2].percentileLatency}`
  );
}

// Test Case 4: Test service_ranking with different orders
function testServiceRanking() {
  const requests = [
    {
      type: "service_ranking",
      metric: "latency",
      order: "asc",
      limit: 3
    },
    {
      type: "service_ranking",
      metric: "latency",
      order: "desc",
      limit: 2
    }
  ];

  const results = analyzeNetworkLatency(sampleLatencyData, requests);
  
  // Check ascending order
  const ascRankings = results[0].rankings;
  console.assert(
    ascRankings.length === 3,
    `Expected 3 services in ascending ranking, got ${ascRankings.length}`
  );
  
  for (let i = 1; i < ascRankings.length; i++) {
    console.assert(
      ascRankings[i].averageLatency >= ascRankings[i-1].averageLatency,
      `Expected ascending order but ${ascRankings[i-1].service} (${ascRankings[i-1].averageLatency}) ` +
      `is before ${ascRankings[i].service} (${ascRankings[i].averageLatency})`
    );
  }
  
  // Check descending order
  const descRankings = results[1].rankings;
  console.assert(
    descRankings.length === 2,
    `Expected 2 services in descending ranking, got ${descRankings.length}`
  );
  
  for (let i = 1; i < descRankings.length; i++) {
    console.assert(
      descRankings[i].averageLatency <= descRankings[i-1].averageLatency,
      `Expected descending order but ${descRankings[i-1].service} (${descRankings[i-1].averageLatency}) ` +
      `is before ${descRankings[i].service} (${descRankings[i].averageLatency})`
    );
  }
}

// Test Case 5: Test path_analysis with different max hops
function testPathAnalysis() {
  const requests = [
    {
      type: "path_analysis",
      source: "service-a",
      destination: "service-d",
      maxHops: 1 // Direct path only
    },
    {
      type: "path_analysis",
      source: "service-a",
      destination: "service-d",
      maxHops: 2 // Up to 1 intermediate service
    }
  ];

  const results = analyzeNetworkLatency(sampleLatencyData, requests);
  
  // Check direct path only
  console.assert(
    results[0].paths.length === 1,
    `Expected 1 direct path, got ${results[0].paths.length}`
  );
  
  console.assert(
    results[0].paths[0].route.length === 2 &&
    results[0].paths[0].route[0] === "service-a" &&
    results[0].paths[0].route[1] === "service-d",
    `Expected direct path from service-a to service-d, got ${JSON.stringify(results[0].paths[0].route)}`
  );
  
  // Check paths with intermediate services
  console.assert(
    results[1].paths.length === 3,
    `Expected 3 paths with maxHops=2, got ${results[1].paths.length}`
  );
  
  // Check that paths are sorted by total latency
  for (let i = 1; i < results[1].paths.length; i++) {
    console.assert(
      results[1].paths[i].totalLatency >= results[1].paths[i-1].totalLatency,
      `Expected paths to be sorted by total latency, but ${results[1].paths[i-1].totalLatency} ` +
      `is before ${results[1].paths[i].totalLatency}`
    );
  }
}

// Run all tests
console.log("Running tests...");
testExample();
testAverageLatency();
testPercentileLatency();
testServiceRanking();
testPathAnalysis();
console.log("All tests completed!");

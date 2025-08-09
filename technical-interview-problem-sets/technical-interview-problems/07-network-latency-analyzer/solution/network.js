/**
 * Analyze network latency data and answer specific queries.
 * 
 * @param {Array} latencyData - Array of latency records with source, destination, timestamp, and latencyMs
 * @param {Array} requests - Array of analysis request objects
 * @return {Array} Array of results, one for each request
 */
function analyzeNetworkLatency(latencyData, requests) {
  // Preprocess the latency data
  const preprocessedData = preprocessLatencyData(latencyData);
  
  // Process each request
  const results = requests.map(request => {
    switch (request.type) {
      case "average_latency":
        return processAverageLatencyRequest(latencyData, request, preprocessedData);
      case "percentile_latency":
        return processPercentileLatencyRequest(latencyData, request, preprocessedData);
      case "service_ranking":
        return processServiceRankingRequest(latencyData, request, preprocessedData);
      case "path_analysis":
        return processPathAnalysisRequest(latencyData, request, preprocessedData);
      default:
        throw new Error(`Unknown request type: ${request.type}`);
    }
  });
  
  return results;
}

/**
 * Preprocess the latency data to build efficient data structures for analysis.
 */
function preprocessLatencyData(latencyData) {
  // Create a map of average latencies between service pairs
  const latencySums = new Map();
  const latencyCounts = new Map();
  
  // Create a graph representation of the network
  const serviceGraph = new Map();
  
  // Create a set of all services
  const services = new Set();
  
  // Process each latency record
  for (const record of latencyData) {
    const { source, destination, latencyMs } = record;
    
    // Add services to the set
    services.add(source);
    services.add(destination);
    
    // Update latency sums and counts
    const key = `${source}|${destination}`;
    if (!latencySums.has(key)) {
      latencySums.set(key, 0);
      latencyCounts.set(key, 0);
    }
    latencySums.set(key, latencySums.get(key) + latencyMs);
    latencyCounts.set(key, latencyCounts.get(key) + 1);
    
    // Update the service graph
    if (!serviceGraph.has(source)) {
      serviceGraph.set(source, new Map());
    }
    serviceGraph.get(source).set(destination, true);
  }
  
  // Calculate average latencies
  const averageLatencies = new Map();
  for (const [key, sum] of latencySums.entries()) {
    const count = latencyCounts.get(key);
    averageLatencies.set(key, sum / count);
  }
  
  // Calculate average outgoing latency for each service
  const serviceOutgoingLatencies = new Map();
  for (const service of services) {
    let totalLatency = 0;
    let totalConnections = 0;
    
    for (const destination of services) {
      if (service === destination) continue;
      
      const key = `${service}|${destination}`;
      if (averageLatencies.has(key)) {
        totalLatency += averageLatencies.get(key);
        totalConnections++;
      }
    }
    
    serviceOutgoingLatencies.set(service, totalConnections > 0 ? totalLatency / totalConnections : 0);
  }
  
  return {
    averageLatencies,
    serviceGraph,
    services: Array.from(services),
    serviceOutgoingLatencies
  };
}

/**
 * Filter latency data based on criteria.
 */
function filterLatencyData(latencyData, criteria) {
  return latencyData.filter(record => {
    // Check source
    if (criteria.source && record.source !== criteria.source) {
      return false;
    }
    
    // Check destination
    if (criteria.destination && record.destination !== criteria.destination) {
      return false;
    }
    
    // Check time range
    if (criteria.timeRange) {
      const recordTime = new Date(record.timestamp).getTime();
      const startTime = new Date(criteria.timeRange.start).getTime();
      const endTime = new Date(criteria.timeRange.end).getTime();
      
      if (recordTime < startTime || recordTime > endTime) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Process an average_latency request.
 */
function processAverageLatencyRequest(latencyData, request, preprocessedData) {
  // Filter the latency data based on the request criteria
  const filteredData = filterLatencyData(latencyData, request);
  
  // Calculate average latency
  if (filteredData.length === 0) {
    return { averageLatency: 0 };
  }
  
  const totalLatency = filteredData.reduce((sum, record) => sum + record.latencyMs, 0);
  const averageLatency = totalLatency / filteredData.length;
  
  return { averageLatency };
}

/**
 * Process a percentile_latency request.
 */
function processPercentileLatencyRequest(latencyData, request, preprocessedData) {
  // Filter the latency data based on the request criteria
  const filteredData = filterLatencyData(latencyData, request);
  
  // Calculate percentile latency
  if (filteredData.length === 0) {
    return { percentileLatency: 0 };
  }
  
  // Sort latencies
  const sortedLatencies = filteredData.map(record => record.latencyMs).sort((a, b) => a - b);
  
  // Calculate the index for the percentile
  const percentile = request.percentile;
  const index = Math.ceil((percentile / 100) * sortedLatencies.length) - 1;
  const clampedIndex = Math.max(0, Math.min(index, sortedLatencies.length - 1));
  
  return { percentileLatency: sortedLatencies[clampedIndex] };
}

/**
 * Process a service_ranking request.
 */
function processServiceRankingRequest(latencyData, request, preprocessedData) {
  const { serviceOutgoingLatencies } = preprocessedData;
  
  // Create rankings
  const rankings = [];
  for (const [service, averageLatency] of serviceOutgoingLatencies.entries()) {
    rankings.push({ service, averageLatency });
  }
  
  // Sort rankings
  rankings.sort((a, b) => {
    if (request.order === "asc") {
      return a.averageLatency - b.averageLatency;
    } else {
      return b.averageLatency - a.averageLatency;
    }
  });
  
  // Apply limit
  const limit = request.limit || rankings.length;
  
  return { rankings: rankings.slice(0, limit) };
}

/**
 * Process a path_analysis request.
 */
function processPathAnalysisRequest(latencyData, request, preprocessedData) {
  const { averageLatencies, serviceGraph } = preprocessedData;
  const { source, destination, maxHops } = request;
  
  // Find all paths from source to destination
  const paths = findAllPaths(source, destination, maxHops || Infinity, serviceGraph, averageLatencies);
  
  // Sort paths by total latency
  paths.sort((a, b) => a.totalLatency - b.totalLatency);
  
  return { paths };
}

/**
 * Find all paths from source to destination with at most maxHops intermediate services.
 */
function findAllPaths(source, destination, maxHops, serviceGraph, averageLatencies) {
  const paths = [];
  const maxDepth = maxHops + 1; // +1 to account for the destination
  
  function dfs(currentNode, currentPath, currentDepth, visitedNodes) {
    // Base case: reached the destination
    if (currentNode === destination) {
      // Calculate total latency for this path
      let totalLatency = 0;
      for (let i = 0; i < currentPath.length - 1; i++) {
        const key = `${currentPath[i]}|${currentPath[i+1]}`;
        totalLatency += averageLatencies.get(key) || 0;
      }
      
      paths.push({
        route: [...currentPath],
        totalLatency
      });
      return;
    }
    
    // Base case: exceeded maximum depth
    if (currentDepth >= maxDepth) {
      return;
    }
    
    // Recursive case: explore neighbors
    const neighbors = serviceGraph.get(currentNode);
    if (!neighbors) return;
    
    for (const [neighbor] of neighbors.entries()) {
      // Skip if already visited (to avoid cycles)
      if (visitedNodes.has(neighbor)) continue;
      
      // Add to the path and visited set
      currentPath.push(neighbor);
      visitedNodes.add(neighbor);
      
      // Recursively explore
      dfs(neighbor, currentPath, currentDepth + 1, visitedNodes);
      
      // Backtrack
      currentPath.pop();
      visitedNodes.delete(neighbor);
    }
  }
  
  // Start DFS from the source
  dfs(source, [source], 0, new Set([source]));
  
  return paths;
}

module.exports = {
  analyzeNetworkLatency
};

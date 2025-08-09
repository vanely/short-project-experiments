/**
 * Find the optimal route to visit all cities exactly once and return to the starting point.
 * 
 * @param {Array} cities - Array of city objects with cityId and name
 * @param {Array} distanceMatrix - 2D array where distanceMatrix[i][j] is the distance from city i to city j
 * @return {Object} An object containing the optimal route and the total distance
 */
function findOptimalRoute(cities, distanceMatrix) {
  // Use brute force for small number of cities (≤ 10) and approximation for larger numbers
  return cities.length <= 10 
    ? bruteForceTSP(cities, distanceMatrix) 
    : nearestNeighborTSP(cities, distanceMatrix);
}

/**
 * Solves the TSP using a brute force approach by checking all permutations.
 * This guarantees the optimal solution but has factorial time complexity.
 */
function bruteForceTSP(cities, distanceMatrix) {
  // We'll fix the starting city as city 0 and permute the rest
  const startCity = 0;
  const otherCities = [];
  
  // Create an array of indices for all cities except the starting city
  for (let i = 0; i < cities.length; i++) {
    if (i !== startCity) {
      otherCities.push(i);
    }
  }
  
  // Generate all permutations of otherCities
  const permutations = generatePermutations(otherCities);
  
  let minDistance = Infinity;
  let bestRoute = [];
  
  // Check each permutation
  for (const perm of permutations) {
    const route = [startCity, ...perm, startCity]; // Start and end at the same city
    let totalDistance = 0;
    
    // Calculate the total distance for this route
    for (let i = 0; i < route.length - 1; i++) {
      totalDistance += distanceMatrix[route[i]][route[i + 1]];
    }
    
    // Update if this route is better
    if (totalDistance < minDistance) {
      minDistance = totalDistance;
      bestRoute = route;
    }
  }
  
  // Convert the route indices to city objects
  const routeWithCities = bestRoute.map(cityIdx => cities.find(city => city.cityId === cityIdx));
  
  return {
    route: routeWithCities,
    totalDistance: minDistance
  };
}

/**
 * Generates all permutations of an array using Heap's algorithm.
 */
function generatePermutations(arr) {
  const result = [];
  
  function heapPermutation(arr, size) {
    // If size is 1, permutation is complete
    if (size === 1) {
      result.push([...arr]);
      return;
    }
    
    // Generate permutations for each element as first element
    for (let i = 0; i < size; i++) {
      heapPermutation(arr, size - 1);
      
      // Swap elements based on parity of size
      if (size % 2 === 1) {
        [arr[0], arr[size - 1]] = [arr[size - 1], arr[0]];
      } else {
        [arr[i], arr[size - 1]] = [arr[size - 1], arr[i]];
      }
    }
  }
  
  heapPermutation(arr, arr.length);
  return result;
}

/**
 * Solves the TSP using the nearest neighbor heuristic.
 * This is a greedy approximation that doesn't guarantee optimality but is much faster.
 */
function nearestNeighborTSP(cities, distanceMatrix) {
  const n = cities.length;
  const startCity = 0;
  const visited = new Set([startCity]);
  const route = [startCity];
  
  let currentCity = startCity;
  let totalDistance = 0;
  
  // Visit each city using the nearest neighbor heuristic
  while (visited.size < n) {
    let nearestCity = -1;
    let minDistance = Infinity;
    
    // Find the nearest unvisited city
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && distanceMatrix[currentCity][i] < minDistance) {
        nearestCity = i;
        minDistance = distanceMatrix[currentCity][i];
      }
    }
    
    // Move to the nearest city
    visited.add(nearestCity);
    route.push(nearestCity);
    totalDistance += minDistance;
    currentCity = nearestCity;
  }
  
  // Return to the starting city
  totalDistance += distanceMatrix[currentCity][startCity];
  route.push(startCity);
  
  // Convert the route indices to city objects
  const routeWithCities = route.map(cityIdx => cities.find(city => city.cityId === cityIdx));
  
  return {
    route: routeWithCities,
    totalDistance: totalDistance
  };
}

module.exports = {
  findOptimalRoute
};

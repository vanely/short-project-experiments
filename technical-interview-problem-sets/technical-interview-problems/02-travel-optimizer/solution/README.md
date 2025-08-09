# Travel Optimizer - Solution

## Approach

This problem is a classic Traveling Salesman Problem (TSP), which is known to be NP-hard. For a small number of cities (as in our constraints), we can use a brute force approach to find the optimal solution by checking all possible permutations of cities.

For larger numbers of cities, approximation algorithms would be more practical. In this solution, I've implemented two approaches:

1. **Brute Force** (for n ≤ 10): Generates all possible permutations of cities and selects the one with the minimum total distance.
2. **Nearest Neighbor Heuristic** (for n > 10): A greedy approach that starts at city 0 and repeatedly visits the closest unvisited city until all cities are visited.

## Solution Explanation

### Brute Force Approach:
1. Generate all possible permutations of city indices (excluding the starting city).
2. For each permutation, calculate the total distance including returning to the starting city.
3. Select the permutation with the minimum total distance.

### Nearest Neighbor Approach:
1. Start with city 0 as the current city.
2. Find the nearest unvisited city and move to it.
3. Repeat step 2 until all cities are visited.
4. Return to the starting city.

The solution chooses between these approaches based on the number of cities to balance accuracy and performance.

## Time Complexity

- Brute Force: O(n!) where n is the number of cities. This is because we generate all permutations.
- Nearest Neighbor: O(n²) where n is the number of cities. In each of n iterations, we need to find the nearest unvisited city, which takes O(n) time.

The overall time complexity is:
- O(n!) for n ≤ 10
- O(n²) for n > 10

## Space Complexity

- Brute Force: O(n!) to store all permutations (though we can optimize to generate them one at a time).
- Nearest Neighbor: O(n) to keep track of visited cities and the current route.

The overall space complexity is:
- O(n!) for n ≤ 10
- O(n) for n > 10

## Optimization Considerations

1. For the brute force approach, we can avoid generating all permutations upfront and instead generate them one at a time.
2. For larger instances, more sophisticated heuristics could be employed, such as:
   - 2-opt or 3-opt local search
   - Simulated annealing
   - Genetic algorithms
   - Branch and bound algorithms

## Key Insights

1. The TSP is a classic NP-hard problem with applications in logistics, circuit design, and DNA sequencing.
2. For small instances, an exact solution is feasible, but for larger instances, approximation algorithms are necessary.
3. There's a trade-off between solution quality and computational efficiency. The brute force approach guarantees optimality but has exponential time complexity, while the nearest neighbor heuristic is much faster but may not find the optimal solution.

This problem demonstrates the importance of selecting the right algorithm based on the problem size and requirements. Understanding when to use exact methods versus approximation techniques is a key skill in algorithm design.

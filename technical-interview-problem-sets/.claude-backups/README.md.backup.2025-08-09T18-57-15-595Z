# Travel Optimizer

## Problem Description

You are developing a software system for a travel agency that needs to find the most efficient route for a salesperson who must visit multiple cities. The system should determine the order of cities to visit that minimizes the total distance traveled, starting and ending at the same city (the home city).

This is a variation of the classic Traveling Salesman Problem (TSP), one of the most studied problems in computational optimization.

## Task

Implement a function `findOptimalRoute(cities, distanceMatrix)` that takes an array of city objects and a distance matrix, and returns the optimal route to visit all cities exactly once before returning to the starting city, minimizing the total distance traveled.

## Input

- `cities`: An array of city objects, each with a `cityId` and `name`.

- `distanceMatrix`: A 2D array where `distanceMatrix[i][j]` represents the distance from city `i` to city `j`.

## Output

Return an object containing:

- `route`: An array of city objects in the order they should be visited (including returning to the starting city).

- `totalDistance`: The total distance of the route.

## Example

```
const cities = [
  { cityId: 0, name: "New York" },
  { cityId: 1, name: "Los Angeles" },
  { cityId: 2, name: "Chicago" },
  { cityId: 3, name: "Houston" }
];

const distanceMatrix = [
  [0, 2786, 790, 1628],
  [2786, 0, 2015, 1547],
  [790, 2015, 0, 1090],
  [1628, 1547, 1090, 0]
];

const result = findOptimalRoute(cities, distanceMatrix);
console.log(result);
/*
Output should be something like:
{
  route: [
    { cityId: 0, name: "New York" },
    { cityId: 2, name: "Chicago" },
    { cityId: 3, name: "Houston" },
    { cityId: 1, name: "Los Angeles" },
    { cityId: 0, name: "New York" }
  ],
  totalDistance: 6143
}
*/
```

## Constraints

- The number of cities will be between 2 and 15.

- All distances are positive integers.

- The distance matrix is symmetric (distance from A to B is the same as B to A).

- The distance from a city to itself is always 0.

## Hints

- This is an NP-hard problem, so an optimal solution for a large number of cities will be computationally expensive.

- For small numbers of cities (up to ~10), a brute force approach can work by trying all possible permutations.

- For larger numbers of cities, consider using approximation algorithms like nearest neighbor, greedy algorithms, or more advanced techniques like genetic algorithms or simulated annealing.

- Start with a simple implementation and then optimize it if needed.
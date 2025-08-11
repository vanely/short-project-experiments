# Insurance Provider Finder

## Problem Description

You are developing a health insurance marketplace application. The system needs to help users find the most affordable health insurance plan that works with their preferred healthcare providers.

You are given three arrays: 
NOTE: populate these entries with actual arrays.

1. $1

2. $1

3. $1

Your task is to implement a function `findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans)` that returns the most affordable insurance plan that covers the highest number of the user's preferred providers.

## Input

- `preferredProviders`: An array of objects, each with a `providerId` and `name`.

- `availableProviders`: An array of objects, each with a `providerId`, `name`, and `networks` (an array of network IDs).

- `insurancePlans`: An array of objects, each with a `planId`, `name`, `monthlyCost`, and `networks` (an array of network IDs the plan works with).

## Output

- Return the insurance plan object that has the lowest `monthlyCost` and covers the highest number of preferred providers.

- If multiple plans cover the same number of providers, return the one with the lowest `monthlyCost`.

- If multiple plans have the same `monthlyCost` and cover the same number of providers, return any of them.

- If no plan covers any of the preferred providers, return `null`.

## Example

```
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
console.log(result);
// Should output the Premium Plan as it's the most affordable plan that covers all three preferred providers
```

## Constraints

- The input arrays may contain between 0 and 10,000 elements.

- Provider IDs and network IDs are unique strings.

- The `monthlyCost` is a positive number.

## Hints

- Consider how to determine which providers are covered by each plan.

- You'll need to map between providers and their networks, and between networks and plans.

- Think about how to efficiently calculate the coverage count for each plan.

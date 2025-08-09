# Subscription Calculator

## Problem Description

You are building a billing system for a SaaS company that offers per-seat subscription pricing. The company wants to track how much they've been paid monthly and in total based on employee usage of their service.

Each employee has a start date when they began using the service. The company is charged monthly per seat (per employee). The monthly cost per seat may change over time, but existing subscriptions are grandfathered at their original price.

## Task

Implement a function `calculateSubscriptionCosts(employees, pricingChanges, endDate)` that calculates:

1. $1

2. $1

## Input

`employees`: An array of employee objects, each with:

- `id`: A unique identifier for the employee

- `name`: The employee's name

- `startDate`: The date when the employee started using the service (in ISO format: YYYY-MM-DD)

- `endDate`: (Optional) The date when the employee stopped using the service (in ISO format: YYYY-MM-DD). If not provided, the employee is still active.

`pricingChanges`: An array of pricing change objects, each with:

- `date`: The date when the pricing change took effect (in ISO format: YYYY-MM-DD)

- `pricePerSeat`: The new monthly price per seat starting from this date

`endDate`: The date up to which to calculate costs (in ISO format: YYYY-MM-DD)

## Output

Return an object with:

- `totalCost`: The total amount paid from the earliest employee start date to the specified end date

- `monthlyCosts`: An object where the keys are month strings (in the format "YYYY-MM") and the values are the amounts paid for that month

## Example

```
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
console.log(result);
/*
Expected output:
{
  totalCost: 775,
  monthlyCosts: {
    "2023-01": 25.81,  // Alice for half a month at $50
    "2023-02": 100,    // Alice for a month at $50 + Bob for a month at $50
    "2023-03": 136.29, // Alice, Bob, and Charlie (from 10th) at $50
    "2023-04": 200,    // Alice at $50 + Bob at $50 + Charlie at $50 (all grandfathered)
    "2023-05": 137.90, // Alice at $50 + Bob until 15th at $50 + Charlie at $50
    "2023-06": 100     // Alice at $50 + Charlie at $50
  }
}
*/
```

## Constraints

- The earliest employee start date is considered the beginning of the subscription period.

- If an employee starts or ends in the middle of a month, the cost is prorated based on the exact number of days in that month.

- Pricing changes take effect at the beginning of the specified date. Existing employees are grandfathered at their original price.

- All dates will be valid ISO format (YYYY-MM-DD).

- There will be at least one pricing change with a date earlier than or equal to the earliest employee start date.

- The end date will be after or equal to the earliest employee start date.

## Hints

- Consider using a Date object for date calculations.

- Track the active price for each employee based on when they started.

- Be careful with date calculations, especially when dealing with different month lengths.

Consider building a timeline of events (employee starts, employee ends, pricing changes) to help calculate the costs.
[
{ date: "2023-01-01", pricePerSeat: 50 },
{ date: "2023-04-01", pricePerSeat: 75 }
];

const endDate = "2023-06-30";

const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
console.log(result);
/*
Expected output:
{
totalCost: 775,
monthlyCosts: {
"2023-01": 25.81,  // Alice for half a month at $50
"2023-02": 100,    // Alice for a month at $50 + Bob for a month at $50
"2023-03": 136.29, // Alice, Bob, and Charlie (from 10th) at $50
"2023-04": 200,    // Alice at $50 + Bob at $50 + Charlie at $50 (all grandfathered)
"2023-05": 137.90, // Alice at $50 + Bob until 15th at $50 + Charlie at $50
"2023-06": 100     // Alice at $50 + Charlie at $50
}
}
*/
```

## Constraints

- The earliest employee start date is considered the beginning of the subscription period.
- If an employee starts or ends in the middle of a month, the cost is prorated based on the exact number of days in that month.
- Pricing changes take effect at the beginning of the specified date. Existing employees are grandfathered at their original price.
- All dates will be valid ISO format (YYYY-MM-DD).
- There will be at least one pricing change with a date earlier than or equal to the earliest employee start date.
- The end date will be after or equal to the earliest employee start date.

## Hints

- Consider using a Date object for date calculations.
- Track the active price for each employee based on when they started.
- Be careful with date calculations, especially when dealing with different month lengths.
- Consider building a timeline of events (employee starts, employee ends, pricing changes) to help calculate the costs.
 [
  { date: "2023-01-01", pricePerSeat: 50 },
  { date: "2023-04-01", pricePerSeat: 75 }
];

const endDate = "2023-06-30";

const result = calculateSubscriptionCosts(employees, pricingChanges, endDate);
console.log(result);
/*
Expected output:
{
  totalCost: 775,
  monthlyCosts: {
    "2023-01": 25.81,  // Alice for half a month at $50
    "2023-02": 100,    // Alice for a month at $50 + Bob for a month at $50
    "2023-03": 136.29, // Alice, Bob, and Charlie (from 10th) at $50
    "2023-04": 200,    // Alice at $50 + Bob at $50 + Charlie at $50 (all grandfathered)
    "2023-05": 137.90, // Alice at $50 + Bob until 15th at $50 + Charlie at $50
    "2023-06": 100     // Alice at $50 + Charlie at $50
  }
}
*/
```

## Constraints

- The earliest employee start date is considered the beginning of the subscription period.

- If an employee starts or ends in the middle of a month, the cost is prorated based on the exact number of days in that month.

- Pricing changes take effect at the beginning of the specified date. Existing employees are grandfathered at their original price.

- All dates will be valid ISO format (YYYY-MM-DD).

- There will be at least one pricing change with a date earlier than or equal to the earliest employee start date.

- The end date will be after or equal to the earliest employee start date.

## Hints

- Consider using a Date object for date calculations.

- Track the active price for each employee based on when they started.

- Be careful with date calculations, especially when dealing with different month lengths.

- Consider building a timeline of events (employee starts, employee ends, pricing changes) to help calculate the costs.
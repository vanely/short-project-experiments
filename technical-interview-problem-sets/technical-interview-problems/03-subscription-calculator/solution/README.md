# Subscription Calculator - Solution

## Approach

This problem requires careful date handling and tracking of active subscriptions over time. The key challenge is to correctly track which employees are active in each month and at what price point. To solve this, we'll use the following approach:

1. Sort the pricing changes by date to ensure we can easily find the applicable price for any given date.
2. Create a timeline of events (employee starts, employee ends) to track when changes happen.
3. For each month in the range from the earliest start date to the end date:
   - Determine which employees are active and for how many days.
   - Calculate the prorated cost for each employee based on their active days and applicable price.
   - Sum these costs to get the monthly total.
4. Sum all monthly costs to get the total cost.

## Solution Explanation

The solution follows these steps:

1. **Preprocessing**:
   - Sort pricing changes by date.
   - Find the earliest start date among all employees to determine when to begin calculations.

2. **Price Determination**:
   - For each employee, determine their applicable price by finding the latest pricing change that occurred before or on their start date.

3. **Monthly Calculations**:
   - For each month in the range, determine the number of days each employee was active.
   - Calculate the prorated cost for each employee based on their active days, the total days in the month, and their applicable price.
   - Sum these costs to get the monthly total.

4. **Result Generation**:
   - Aggregate monthly costs to get the total cost.
   - Format and return the results as specified.

## Time Complexity

- Sorting pricing changes: O(p log p) where p is the number of pricing changes.
- Finding the earliest start date: O(e) where e is the number of employees.
- Calculating costs for each employee for each month: O(e * m) where m is the number of months between the earliest start date and the end date.

Overall time complexity: O(p log p + e * m)

## Space Complexity

- Storage for pricing changes: O(p)
- Storage for employee pricing: O(e)
- Storage for monthly costs: O(m)

Overall space complexity: O(p + e + m)

## Optimization Considerations

1. **Efficient Date Handling**: The solution uses efficient date calculations, avoiding unnecessary Date object creations when possible.

2. **Grandfathered Pricing**: The solution carefully tracks the applicable price for each employee based on when they started, ensuring that existing subscriptions are correctly grandfathered.

3. **Prorating**: The solution correctly prorates costs for partial months, taking into account the exact number of days in each month.

4. **Timeline Approach**: For larger datasets, a more efficient approach could be to build a complete timeline of events and process them in chronological order, but the current approach is simpler and works well for the given constraints.

## Key Insights

1. **Date Handling Complexity**: This problem illustrates the challenges of working with dates, especially when dealing with varying month lengths and partial months.

2. **Business Logic Implementation**: The solution demonstrates how to implement complex business logic around subscription pricing, including grandfathering and prorating.

3. **Event-Based Calculations**: The problem is a good example of an event-based calculation, where costs are determined based on a series of events (employee starts, employee ends, pricing changes) over time.

This problem is representative of real-world subscription billing systems, where accurate tracking of usage and appropriate pricing is critical for revenue management.

# Multi-Tier Discount - Solution

## Approach

This problem involves implementing a flexible discount system that can apply various types of discounts based on different conditions. The key challenge is to correctly evaluate the conditions, apply the discounts in the right order, and handle stackable vs. non-stackable discounts.

To solve this problem, we'll take the following approach:

1. Filter the discount rules to find the ones that apply to the given order and customer.
2. Sort the applicable rules by priority.
3. Apply the discounts in order, taking into account whether they are stackable.
4. Calculate the final order amount.

## Solution Explanation

### 1. Evaluating Conditions

For each discount rule, we need to check if all its conditions are satisfied. The solution implements a set of condition evaluators for each condition type:

- **order_total**: Compares the order total against a threshold.
- **loyalty_tier**: Checks the customer's loyalty tier.
- **product_category**: Verifies if the order contains items from a specific category.
- **date_range**: Determines if the order date falls within a specific range.
- **purchase_history**: Examines the customer's purchase history.
- **registration_date**: Checks how long the customer has been registered.

### 2. Applying Discounts

Once we have filtered the applicable discount rules and sorted them by priority, we apply them in the following manner:

- **Percentage Discounts**: Calculate a percentage of the current order amount.
- **Fixed Amount Discounts**: Subtract a fixed amount from the current order amount.
- **Buy X Get Y Discounts**: Apply discounts to eligible items based on the discount's buy/get ratio.

### 3. Handling Stackability

For non-stackable discounts, once applied, no other discounts can be combined with them. The solution keeps track of whether a non-stackable discount has been applied and skips all other discounts if that's the case.

### 4. Calculating the Final Amount

After applying all applicable discounts, we calculate the final order amount and return the result, including the applied discounts and their amounts.

## Time Complexity

- Evaluating conditions for all discount rules: O(R * C), where R is the number of rules and C is the average number of conditions per rule.
- Sorting applicable rules by priority: O(R log R).
- Applying discounts: O(R * I), where I is the number of items in the order (especially for buy_x_get_y discounts that require item-level processing).

Overall time complexity: O(R * (C + log R + I))

## Space Complexity

- Storage for applicable rules: O(R).
- Storage for applied discounts: O(R).
- Temporary storage for item processing: O(I).

Overall space complexity: O(R + I)

## Optimization Considerations

1. **Early Termination**: If a non-stackable discount is applied, we can stop processing further discounts, saving computation time.

2. **Condition Caching**: For repeated condition checks (like checking if an order contains items from a specific category), we can cache the results to avoid redundant computations.

3. **Rule Indexing**: In a real-world system, discount rules could be indexed by their condition types to quickly find applicable rules without checking all rules.

4. **Parallel Processing**: For large numbers of rules or complex conditions, parallel processing could be used to evaluate conditions simultaneously.

## Key Insights

1. **Rule Prioritization**: The order in which discount rules are applied can significantly affect the final discount amount, especially for percentage discounts applied sequentially.

2. **Condition Evaluation**: A modular approach to condition evaluation makes the system flexible and extensible, allowing for new condition types to be easily added.

3. **Date and Time Handling**: When dealing with date-based conditions, careful parsing and comparison is needed to correctly evaluate conditions.

4. **Item-Level vs. Order-Level Discounts**: Some discounts (like buy_x_get_y) require item-level processing, while others (like percentage discounts on the order total) can be applied at the order level, which affects how the discount calculation is structured.

This problem showcases real-world e-commerce pricing systems, where complex discount strategies need to be implemented in a flexible and maintainable way.

# Multi-Tier Discount

## Problem Description

You are developing a pricing system for an e-commerce platform that offers multi-tier discounts. The platform wants to implement a flexible discount strategy where customers can receive different discount rates based on their purchase history, loyalty status, and the current order's characteristics.

## Task

Implement a function `calculateDiscount(order, customer, discountRules)` that calculates the total discount amount for a given order based on a set of discount rules.

## Input

`order`: An object representing the current order with:

`items`: An array of item objects, each with:

- `productId`: The ID of the product

- `category`: The category of the product

- `price`: The price of the product

- `quantity`: The quantity ordered

`totalAmount`: The total amount of the order before any discounts
`date`: The date of the order (ISO format: YYYY-MM-DD)

`customer`: An object representing the customer with:

- `id`: A unique identifier for the customer

- `loyaltyTier`: The loyalty tier of the customer ('bronze', 'silver', 'gold', or 'platinum')

- `registrationDate`: The date when the customer registered (ISO format: YYYY-MM-DD)

`purchaseHistory`: An array of previous order objects, each with:

- `orderDate`: The date of the previous order (ISO format: YYYY-MM-DD)

- `totalAmount`: The total amount of the previous order

`discountRules`: An array of discount rule objects, each with:

- `id`: A unique identifier for the rule

- `type`: The type of discount rule ('percentage', 'fixed_amount', or 'buy_x_get_y')

- `value`: The value of the discount (percentage or amount)

`conditions`: An array of condition objects, each with:

- `type`: The type of condition

- `operator`: The comparison operator

- `value`: The value to compare against

`priority`: The priority of the rule (higher priority rules are applied first)
`stackable`: A boolean indicating whether the rule can be combined with other rules

## Output

Return an object with:

- `orderTotal`: The original order total

- `discountAmount`: The total discount amount

- `finalAmount`: The final amount after applying discounts

`appliedDiscounts`: An array of applied discount objects, each with:

- `ruleId`: The ID of the applied discount rule

- `discountAmount`: The amount of the discount

## Discount Rule Types

### 1. "percentage"

Applies a percentage discount on the order total or specific items.

Example:

```
{
  id: "summer_sale",
  type: "percentage",
  value: 15,  // 15% discount
  conditions: [
    { type: "date_range", operator: "between", value: ["2023-06-01", "2023-08-31"] }
  ],
  priority: 1,
  stackable: true
}
```

### 2. "fixed_amount"

Applies a fixed amount discount on the order total or specific items.

Example:

```
{
  id: "new_customer",
  type: "fixed_amount",
  value: 10,  // $10 discount
  conditions: [
    { type: "registration_date", operator: "within_last", value: "30d" }
  ],
  priority: 2,
  stackable: false
}
```

### 3. "buy_x_get_y"

Buy X items, get Y items free or at a discount.

Example:

```
{
  id: "buy_one_get_one",
  type: "buy_x_get_y",
  value: { buy: 1, get: 1, discount: 100 },  // Buy 1, get 1 free
  conditions: [
    { type: "product_category", operator: "equals", value: "electronics" }
  ],
  priority: 3,
  stackable: true
}
```

## Condition Types

### 1. "order_total"

Compares the order total against a threshold.

Example:

```
{ type: "order_total", operator: "gte", value: 100 }  // Order total >= $100
```

### 2. "loyalty_tier"

Checks the customer's loyalty tier.

Example:

```
{ type: "loyalty_tier", operator: "in", value: ["gold", "platinum"] }
```

### 3. "product_category"

Checks if the order contains items from a specific category.

Example:

```
{ type: "product_category", operator: "equals", value: "clothing" }
```

### 4. "date_range"

Checks if the order date falls within a specific range.

Example:

```
{ type: "date_range", operator: "between", value: ["2023-11-20", "2023-11-30"] }
```

### 5. "purchase_history"

Checks the customer's purchase history.

Example:

```
{ type: "purchase_history", operator: "total_orders_gte", value: 5 }
```

### 6. "registration_date"

Checks how long the customer has been registered.

Example:

```
{ type: "registration_date", operator: "within_last", value: "90d" }  // Within last 90 days
```

## Discount Application Rules
NOTE: update and populate the rule list

1. $1

2. $1

3. $1

4. $1

5. $1

## Example

```
const order = {
  items: [
    { productId: "p1", category: "electronics", price: 100, quantity: 2 },
    { productId: "p2", category: "clothing", price: 50, quantity: 1 }
  ],
  totalAmount: 250,
  date: "2023-06-15"
};

const customer = {
  id: "c123",
  loyaltyTier: "gold",
  registrationDate: "2022-01-10",
  purchaseHistory: [
    { orderDate: "2023-05-20", totalAmount: 150 },
    { orderDate: "2023-04-10", totalAmount: 200 }
  ]
};

const discountRules = [
  {
    id: "summer_sale",
    type: "percentage",
    value: 10,
    conditions: [
      { type: "date_range", operator: "between", value: ["2023-06-01", "2023-08-31"] }
    ],
    priority: 1,
    stackable: true
  },
  {
    id: "loyalty_discount",
    type: "percentage",
    value: 5,
    conditions: [
      { type: "loyalty_tier", operator: "in", value: ["gold", "platinum"] }
    ],
    priority: 2,
    stackable: true
  },
  {
    id: "buy_one_get_one_half_off",
    type: "buy_x_get_y",
    value: { buy: 1, get: 1, discount: 50 },
    conditions: [
      { type: "product_category", operator: "equals", value: "electronics" }
    ],
    priority: 3,
    stackable: false
  }
];

const result = calculateDiscount(order, customer, discountRules);
console.log(result);
/*
Expected output:
{
  orderTotal: 250,
  discountAmount: 75,
  finalAmount: 175,
  appliedDiscounts: [
    { ruleId: "buy_one_get_one_half_off", discountAmount: 50 },
    { ruleId: "summer_sale", discountAmount: 20 },
    { ruleId: "loyalty_discount", discountAmount: 5 }
  ]
}
*/
```

## Constraints

- The order may contain up to 100 items.

- The number of discount rules can be up to 50.

- Each discount rule can have up to 10 conditions.

- All monetary values are positive numbers with up to 2 decimal places.

- The discount rules are valid and do not have contradictory conditions.

## Hints

- Start by filtering the discount rules that apply to the order and customer.

- Sort the applicable rules by priority.

- Apply each rule and track the discounts.

- Consider how to handle stackable vs. non-stackable discounts.

- Handle the special case of "buy_x_get_y" discounts, which might require grouping items by category.

# JSON Transformer

## Problem Description

You are working on a system that integrates with various APIs, each returning data in different JSON formats. Your task is to create a function that can transform these JSON responses into a standardized format that your application can process.

The transformation requirements can vary depending on the data source, so your function needs to be flexible enough to handle various transformation rules.

## Task

Implement a function `transformJson(input, transformationRules)` that takes a JSON object and a set of transformation rules, and returns a new JSON object that follows the specified rules.

## Input

- `input`: A JSON object representing the data from an external API.

- `transformationRules`: An array of rule objects, each specifying a transformation to apply.

Each rule object has the following structure:

- `type`: A string specifying the type of transformation (e.g., "rename", "format", "restructure", "filter", "calculate").

- Additional properties specific to the transformation type.

## Output

- Return a new JSON object that has been transformed according to the rules.

## Transformation Types

### 1. "rename" - Rename a field

```
{
  type: "rename",
  from: "sourceField",
  to: "targetField"
}
```

Renames the field specified by `from` to the name specified by `to`.

### 2. "format" - Format a field value

```
{
  type: "format",
  field: "fieldName",
  formatType: "date" | "uppercase" | "lowercase" | "number"
}
```

- For "date", converts a date string to the format "YYYY-MM-DD".

- For "uppercase", converts a string to uppercase.

- For "lowercase", converts a string to lowercase.

- For "number", formats a number to have 2 decimal places.

### 3. "restructure" - Move a field to a nested location

```
{
  type: "restructure",
  from: "sourceField",
  to: "parent.child.targetField"
}
```

Moves the field specified by `from` to a nested location specified by `to`. Creates any necessary intermediate objects.

### 4. "filter" - Filter an array based on a condition

```
{
  type: "filter",
  field: "arrayField",
  condition: {
    field: "fieldName",
    operator: "eq" | "gt" | "lt" | "contains",
    value: "value"
  }
}
```

Filters the array specified by `field` to include only elements that match the condition.

### 5. "calculate" - Calculate a new field

```
{
  type: "calculate",
  targetField: "newField",
  operation: "sum" | "average" | "min" | "max" | "count",
  sourceField: "arrayField",
  valueField: "fieldName" // Optional, used for sum and average operations
}
```

Creates a new field with the result of the calculation operation on the specified array.

## Example

```
const input = {
  customerData: {
    id: 12345,
    firstName: "john",
    lastName: "doe",
    joinDate: "12/31/2022"
  },
  orders: [
    { id: 1, total: 99.99, date: "01/15/2023", status: "completed" },
    { id: 2, total: 149.99, date: "02/20/2023", status: "pending" },
    { id: 3, total: 49.99, date: "03/10/2023", status: "completed" }
  ]
};

const transformationRules = [
  { type: "rename", from: "customerData.firstName", to: "customerData.first_name" },
  { type: "rename", from: "customerData.lastName", to: "customerData.last_name" },
  { type: "format", field: "customerData.first_name", formatType: "uppercase" },
  { type: "format", field: "customerData.last_name", formatType: "uppercase" },
  { type: "format", field: "customerData.joinDate", formatType: "date" },
  { type: "filter", field: "orders", condition: { field: "status", operator: "eq", value: "completed" } },
  { type: "calculate", targetField: "orderStats.totalSpent", operation: "sum", sourceField: "orders", valueField: "total" },
  { type: "calculate", targetField: "orderStats.orderCount", operation: "count", sourceField: "orders" }
];

const result = transformJson(input, transformationRules);
console.log(result);
/*
Expected output:
{
  customerData: {
    id: 12345,
    first_name: "JOHN",
    last_name: "DOE",
    joinDate: "2022-12-31"
  },
  orders: [
    { id: 1, total: 99.99, date: "01/15/2023", status: "completed" },
    { id: 3, total: 49.99, date: "03/10/2023", status: "completed" }
  ],
  orderStats: {
    totalSpent: 149.98,
    orderCount: 2
  }
}
*/
```

## Constraints

- The input JSON can have nested objects up to a depth of 5.

- Arrays can contain up to 1000 elements.

- The transformation rules will be valid and will not conflict with each other.

- Field names in the JSON can be accessed using dot notation (e.g., "customer.address.city").

- All calculations should be performed on the transformed data after all other transformations have been applied.

## Hints

- Consider using recursion or a utility function to handle nested field access and modification.

- Process the transformation rules in the order they are provided.

- For date formatting, consider using the built-in Date object.

- Be careful with deep cloning of objects to avoid modifying the original input.
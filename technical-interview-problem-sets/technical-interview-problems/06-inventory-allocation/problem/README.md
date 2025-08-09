# Inventory Allocation

## Problem Description

You are developing an inventory management system for an e-commerce company that has multiple warehouses. When a customer places an order, the system needs to determine which warehouses should fulfill the order based on inventory availability and shipping costs.

## Task

Implement a function `allocateInventory(order, warehouses)` that takes an order and a list of warehouses, and returns an allocation plan that minimizes the total shipping cost while fulfilling the entire order.

## Input

`order`: An object representing a customer order with:

`items`: An array of item objects, each with:

- `productId`: The ID of the product

- `quantity`: The quantity ordered

`warehouses`: An array of warehouse objects, each with:

- `id`: A unique identifier for the warehouse

- `name`: The name of the warehouse

- `inventory`: An object mapping product IDs to quantities available

- `shippingCosts`: An object mapping regions to shipping costs per item

## Output

Return an allocation plan object with:

- `totalCost`: The total shipping cost for the allocation

`allocations`: An array of allocation objects, each with:

- `warehouseId`: The ID of the warehouse

`items`: An array of item objects, each with:

- `productId`: The ID of the product

- `quantity`: The quantity to be shipped from this warehouse

## Example

```
const order = {
  customerId: 123,
  region: "East",
  items: [
    { productId: "P1", quantity: 5 },
    { productId: "P2", quantity: 3 }
  ]
};

const warehouses = [
  {
    id: "W1",
    name: "Warehouse 1",
    inventory: { "P1": 3, "P2": 2, "P3": 10 },
    shippingCosts: { "East": 5, "West": 10, "Central": 7 }
  },
  {
    id: "W2",
    name: "Warehouse 2",
    inventory: { "P1": 4, "P2": 5, "P4": 8 },
    shippingCosts: { "East": 6, "West": 8, "Central": 5 }
  },
  {
    id: "W3",
    name: "Warehouse 3",
    inventory: { "P1": 2, "P3": 4, "P4": 3 },
    shippingCosts: { "East": 8, "West": 6, "Central": 9 }
  }
];

const result = allocateInventory(order, warehouses);
console.log(result);
/*
Expected output:
{
  totalCost: 39,
  allocations: [
    {
      warehouseId: "W1",
      items: [
        { productId: "P1", quantity: 3 },
        { productId: "P2", quantity: 2 }
      ]
    },
    {
      warehouseId: "W2",
      items: [
        { productId: "P1", quantity: 2 },
        { productId: "P2", quantity: 1 }
      ]
    }
  ]
}
*/
```

In this example:

- Warehouse 1 ships 3 units of P1 at $5 each and 2 units of P2 at $5 each (total: $25)

- Warehouse 2 ships 2 units of P1 at $6 each and 1 unit of P2 at $6 each (total: $18)

- Total shipping cost: $43

## Constraints

- All warehouses combined will have enough inventory to fulfill the order.

- Shipping costs are per item (not per order).

- The goal is to minimize the total shipping cost.

- If multiple allocation plans have the same total cost, any valid plan can be returned.

- The number of warehouses can be between 1 and 100.

- The number of items in an order can be between 1 and 50.

- All quantities and costs are positive integers.

## Hints

- This problem can be approached as a variant of the transportation problem or the minimum cost flow problem.

- Consider a greedy approach: for each product, allocate from the warehouse with the lowest shipping cost first.

- You may need to split the allocation of a single product across multiple warehouses.

- Keep track of the remaining inventory as you make allocations.
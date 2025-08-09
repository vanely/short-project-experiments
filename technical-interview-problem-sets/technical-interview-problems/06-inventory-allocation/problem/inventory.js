/**
 * Allocate inventory from warehouses to fulfill an order with minimum shipping cost.
 * 
 * @param {Object} order - The customer order with items and region
 * @param {Array} warehouses - Array of warehouse objects with inventory and shipping costs
 * @return {Object} An allocation plan with totalCost and allocations
 */
function allocateInventory(order, warehouses) {
  // Your implementation here
  
  return {
    totalCost: 0,
    allocations: []
  };
}

module.exports = {
  allocateInventory
};

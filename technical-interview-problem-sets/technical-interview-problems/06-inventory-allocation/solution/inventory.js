/**
 * Allocate inventory from warehouses to fulfill an order with minimum shipping cost.
 * 
 * @param {Object} order - The customer order with items and region
 * @param {Array} warehouses - Array of warehouse objects with inventory and shipping costs
 * @return {Object} An allocation plan with totalCost and allocations
 */
function allocateInventory(order, warehouses) {
  // Create a deep copy of warehouses to track remaining inventory
  const warehousesWithInventory = warehouses.map(warehouse => ({
    ...warehouse,
    inventory: { ...warehouse.inventory },
    region: order.region
  }));
  
  // Initialize the allocation plan
  const allocationPlan = {
    totalCost: 0,
    allocations: []
  };
  
  // Process each item in the order
  for (const item of order.items) {
    const { productId, quantity } = item;
    let remainingQuantity = quantity;
    
    // Sort warehouses by shipping cost for the order's region
    const sortedWarehouses = [...warehousesWithInventory]
      .filter(warehouse => (warehouse.inventory[productId] || 0) > 0)
      .sort((a, b) => a.shippingCosts[order.region] - b.shippingCosts[order.region]);
    
    // Allocate from warehouses with the lowest shipping cost first
    for (const warehouse of sortedWarehouses) {
      if (remainingQuantity <= 0) break;
      
      const availableQuantity = warehouse.inventory[productId] || 0;
      const allocatedQuantity = Math.min(availableQuantity, remainingQuantity);
      
      if (allocatedQuantity > 0) {
        // Update warehouse inventory
        warehouse.inventory[productId] -= allocatedQuantity;
        
        // Update remaining quantity
        remainingQuantity -= allocatedQuantity;
        
        // Update allocation plan
        updateAllocationPlan(
          allocationPlan, 
          warehouse.id, 
          productId, 
          allocatedQuantity, 
          warehouse.shippingCosts[order.region]
        );
      }
    }
    
    // Ensure the entire order is fulfilled
    if (remainingQuantity > 0) {
      throw new Error(`Not enough inventory to fulfill order for product ${productId}`);
    }
  }
  
  return allocationPlan;
}

/**
 * Update the allocation plan with a new allocation.
 * 
 * @param {Object} allocationPlan - The current allocation plan
 * @param {string} warehouseId - The ID of the warehouse to allocate from
 * @param {string} productId - The ID of the product to allocate
 * @param {number} quantity - The quantity to allocate
 * @param {number} shippingCost - The shipping cost per unit
 */
function updateAllocationPlan(allocationPlan, warehouseId, productId, quantity, shippingCost) {
  // Update total cost
  allocationPlan.totalCost += quantity * shippingCost;
  
  // Find existing allocation for this warehouse or create a new one
  let allocation = allocationPlan.allocations.find(a => a.warehouseId === warehouseId);
  
  if (!allocation) {
    allocation = {
      warehouseId,
      items: []
    };
    allocationPlan.allocations.push(allocation);
  }
  
  // Find existing item allocation or create a new one
  let itemAllocation = allocation.items.find(item => item.productId === productId);
  
  if (!itemAllocation) {
    itemAllocation = {
      productId,
      quantity: 0
    };
    allocation.items.push(itemAllocation);
  }
  
  // Update quantity
  itemAllocation.quantity += quantity;
}

module.exports = {
  allocateInventory
};

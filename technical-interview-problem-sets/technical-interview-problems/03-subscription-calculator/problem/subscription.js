/**
 * Calculate the total and monthly subscription costs based on employee usage.
 * 
 * @param {Array} employees - Array of employee objects with id, name, startDate, and optional endDate
 * @param {Array} pricingChanges - Array of pricing change objects with date and pricePerSeat
 * @param {string} endDate - The date up to which to calculate costs (in ISO format: YYYY-MM-DD)
 * @return {Object} An object with totalCost and monthlyCosts
 */
function calculateSubscriptionCosts(employees, pricingChanges, endDate) {
  // Your implementation here
  
  return {
    totalCost: 0,
    monthlyCosts: {}
  };
}

module.exports = {
  calculateSubscriptionCosts
};

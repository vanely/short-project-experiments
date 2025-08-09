/**
 * Calculate the total and monthly subscription costs based on employee usage.
 * 
 * @param {Array} employees - Array of employee objects with id, name, startDate, and optional endDate
 * @param {Array} pricingChanges - Array of pricing change objects with date and pricePerSeat
 * @param {string} endDate - The date up to which to calculate costs (in ISO format: YYYY-MM-DD)
 * @return {Object} An object with totalCost and monthlyCosts
 */
function calculateSubscriptionCosts(employees, pricingChanges, endDate) {
  // Sort pricing changes by date (earliest first)
  pricingChanges.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Find the earliest start date among all employees
  let earliestStartDate = employees.reduce(
    (earliest, emp) => {
      const startDate = new Date(emp.startDate);
      return startDate < earliest ? startDate : earliest;
    },
    new Date(employees[0].startDate)
  );
  
  // Create a mapping of employee ID to their applicable price (grandfathered)
  const employeePricing = {};
  for (const employee of employees) {
    const startDate = new Date(employee.startDate);
    let applicablePrice = 0;
    
    // Find the latest pricing change that occurred before or on the employee's start date
    for (const priceChange of pricingChanges) {
      const priceChangeDate = new Date(priceChange.date);
      if (priceChangeDate <= startDate) {
        applicablePrice = priceChange.pricePerSeat;
      } else {
        break; // Stop once we've passed the employee's start date
      }
    }
    
    employeePricing[employee.id] = applicablePrice;
  }
  
  // Initialize result
  const monthlyCosts = {};
  let totalCost = 0;
  
  // Calculate costs month by month
  const endDateObj = new Date(endDate);
  let currentDate = new Date(earliestStartDate);
  currentDate.setDate(1); // Start from the beginning of the month
  
  while (currentDate <= endDateObj) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    
    // Calculate days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Calculate cost for this month
    let monthCost = 0;
    
    for (const employee of employees) {
      const employeeStartDate = new Date(employee.startDate);
      const employeeEndDate = employee.endDate ? new Date(employee.endDate) : null;
      
      // Skip if employee hasn't started yet or has already left
      if (employeeStartDate > new Date(year, month + 1, 0) || 
          (employeeEndDate && employeeEndDate < new Date(year, month, 1))) {
        continue;
      }
      
      // Calculate active days in this month
      let startDay = 1;
      if (employeeStartDate.getFullYear() === year && employeeStartDate.getMonth() === month) {
        startDay = employeeStartDate.getDate();
      }
      
      let endDay = daysInMonth;
      if (employeeEndDate && employeeEndDate.getFullYear() === year && employeeEndDate.getMonth() === month) {
        endDay = employeeEndDate.getDate();
      }
      
      // Calculate prorated cost based on active days
      const activeDays = endDay - startDay + 1;
      const employeeCost = employeePricing[employee.id] * (activeDays / daysInMonth);
      monthCost += employeeCost;
    }
    
    // Round to 2 decimal places for money
    monthCost = Math.round(monthCost * 100) / 100;
    
    // Add to results
    if (monthCost > 0) {
      monthlyCosts[monthKey] = monthCost;
      totalCost += monthCost;
    }
    
    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  // Round the total cost to 2 decimal places
  totalCost = Math.round(totalCost * 100) / 100;
  
  return {
    totalCost,
    monthlyCosts
  };
}

module.exports = {
  calculateSubscriptionCosts
};

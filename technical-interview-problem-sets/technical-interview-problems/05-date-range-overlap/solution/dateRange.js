/**
 * Find all overlapping pairs of date ranges and determine the extent of their overlap.
 * 
 * @param {Array} dateRanges - Array of date range objects with id, start, and end properties
 * @return {Array} Array of overlap objects with range1Id, range2Id, overlapStart, overlapEnd, and overlapDays
 */
function findDateRangeOverlaps(dateRanges) {
  const overlaps = [];
  
  // Iterate through all possible pairs of date ranges
  for (let i = 0; i < dateRanges.length; i++) {
    for (let j = i + 1; j < dateRanges.length; j++) {
      const range1 = dateRanges[i];
      const range2 = dateRanges[j];
      
      // Check if the ranges overlap
      if (rangesOverlap(range1, range2)) {
        // Calculate the overlap details
        const overlapDetails = calculateOverlap(range1, range2);
        
        // Add to results, ensuring the correct order of range IDs
        if (range1.id < range2.id) {
          overlaps.push({
            range1Id: range1.id,
            range2Id: range2.id,
            ...overlapDetails
          });
        } else {
          overlaps.push({
            range1Id: range2.id,
            range2Id: range1.id,
            ...overlapDetails
          });
        }
      }
    }
  }
  
  // Sort the results by range1Id, then by range2Id
  overlaps.sort((a, b) => {
    if (a.range1Id !== b.range1Id) {
      return a.range1Id - b.range1Id;
    }
    return a.range2Id - b.range2Id;
  });
  
  return overlaps;
}

/**
 * Check if two date ranges overlap.
 * 
 * @param {Object} range1 - First date range object
 * @param {Object} range2 - Second date range object
 * @return {boolean} True if the ranges overlap, false otherwise
 */
function rangesOverlap(range1, range2) {
  // Two ranges overlap if one range's start is before or on the other's end,
  // and one range's end is after or on the other's start
  return range1.start <= range2.end && range1.end >= range2.start;
}

/**
 * Calculate the details of the overlap between two date ranges.
 * 
 * @param {Object} range1 - First date range object
 * @param {Object} range2 - Second date range object
 * @return {Object} Object with overlapStart, overlapEnd, and overlapDays
 */
function calculateOverlap(range1, range2) {
  // The overlap starts at the later of the two start dates
  const overlapStart = range1.start > range2.start ? range1.start : range2.start;
  
  // The overlap ends at the earlier of the two end dates
  const overlapEnd = range1.end < range2.end ? range1.end : range2.end;
  
  // Calculate the number of days in the overlap (inclusive)
  const overlapDays = calculateDaysInclusive(overlapStart, overlapEnd);
  
  return {
    overlapStart,
    overlapEnd,
    overlapDays
  };
}

/**
 * Calculate the number of days between two dates, inclusive of both dates.
 * 
 * @param {string} startDate - Start date in ISO format (YYYY-MM-DD)
 * @param {string} endDate - End date in ISO format (YYYY-MM-DD)
 * @return {number} Number of days, inclusive of both start and end dates
 */
function calculateDaysInclusive(startDate, endDate) {
  // Convert to Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate the difference in milliseconds
  const diffInMs = end - start;
  
  // Convert to days and add 1 to make it inclusive
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
  
  return diffInDays;
}

module.exports = {
  findDateRangeOverlaps
};

/**
 * Schedule events to time slots while respecting resource constraints.
 * 
 * @param {Array} events - Array of event objects with id, name, duration, and resourceRequirements
 * @param {Object} resources - Object mapping resource types to their total quantity
 * @param {Array} timeSlots - Array of time slot objects with id, startTime, endTime, and resourcesInUse
 * @return {Object} An object with scheduledEvents and unscheduledEvents
 */
function scheduleEvents(events, resources, timeSlots) {
  // Create deep copies to avoid modifying the original objects
  const eventsCopy = JSON.parse(JSON.stringify(events));
  const timeSlotsCopy = JSON.parse(JSON.stringify(timeSlots));
  
  // Sort events by a combination of resource requirements and duration
  // This prioritizes events that are more constrained
  eventsCopy.sort((a, b) => {
    // First compare by total number of resource types required
    const aResourceCount = Object.keys(a.resourceRequirements).length;
    const bResourceCount = Object.keys(b.resourceRequirements).length;
    
    if (aResourceCount !== bResourceCount) {
      return bResourceCount - aResourceCount; // More resource types first
    }
    
    // Then compare by total quantity of resources required
    const aTotalResources = Object.values(a.resourceRequirements).reduce((sum, qty) => sum + qty, 0);
    const bTotalResources = Object.values(b.resourceRequirements).reduce((sum, qty) => sum + qty, 0);
    
    if (aTotalResources !== bTotalResources) {
      return bTotalResources - aTotalResources; // More resources first
    }
    
    // Finally compare by duration
    return b.duration - a.duration; // Longer duration first
  });
  
  // Sort time slots by start time to ensure we schedule events in the earliest available slots
  timeSlotsCopy.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  const scheduledEvents = [];
  const unscheduledEvents = [];
  
  // Try to schedule each event
  for (const event of eventsCopy) {
    let scheduled = false;
    
    // Try each time slot
    for (const timeSlot of timeSlotsCopy) {
      // Check if the time slot has enough duration for the event
      const slotDuration = (new Date(timeSlot.endTime) - new Date(timeSlot.startTime)) / (1000 * 60); // in minutes
      
      if (slotDuration < event.duration) {
        continue; // Skip this time slot
      }
      
      // Check if all required resources are available
      let resourcesAvailable = true;
      
      for (const resourceType in event.resourceRequirements) {
        const required = event.resourceRequirements[resourceType] || 0;
        const inUse = timeSlot.resourcesInUse[resourceType] || 0;
        const available = resources[resourceType] || 0;
        
        if (inUse + required > available) {
          resourcesAvailable = false;
          break;
        }
      }
      
      if (!resourcesAvailable) {
        continue; // Skip this time slot
      }
      
      // Schedule the event to this time slot
      const startTime = timeSlot.startTime;
      const endTime = new Date(new Date(startTime).getTime() + event.duration * 60000).toISOString();
      
      scheduledEvents.push({
        eventId: event.id,
        timeSlotId: timeSlot.id,
        startTime,
        endTime
      });
      
      // Update resources in use
      for (const resourceType in event.resourceRequirements) {
        timeSlot.resourcesInUse[resourceType] = 
          (timeSlot.resourcesInUse[resourceType] || 0) + 
          (event.resourceRequirements[resourceType] || 0);
      }
      
      scheduled = true;
      break; // Move to the next event
    }
    
    if (!scheduled) {
      unscheduledEvents.push(event.id);
    }
  }
  
  return {
    scheduledEvents,
    unscheduledEvents
  };
}

module.exports = {
  scheduleEvents
};

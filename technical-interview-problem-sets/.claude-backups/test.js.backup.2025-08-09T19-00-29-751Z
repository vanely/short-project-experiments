const { scheduleEvents } = require('./scheduler');

// Helper function to check if two time strings are equal
function timeEquals(time1, time2) {
  return new Date(time1).getTime() === new Date(time2).getTime();
}

// Helper function to validate resource constraints
function validateResourceConstraints(event, timeSlot, resources) {
  // Check if the time slot has enough duration
  const slotDuration = (new Date(timeSlot.endTime) - new Date(timeSlot.startTime)) / (1000 * 60); // in minutes
  if (slotDuration < event.duration) {
    return false;
  }
  
  // Check if all required resources are available
  for (const resourceType in event.resourceRequirements) {
    const required = event.resourceRequirements[resourceType] || 0;
    const inUse = timeSlot.resourcesInUse[resourceType] || 0;
    const available = resources[resourceType] || 0;
    
    if (inUse + required > available) {
      return false;
    }
  }
  
  return true;
}

// Helper function to validate a schedule
function validateSchedule(result, events, resources, timeSlots) {
  const { scheduledEvents, unscheduledEvents } = result;
  
  // Check that all events are accounted for
  const allEventIds = new Set(events.map(e => e.id));
  const scheduledIds = new Set(scheduledEvents.map(e => e.eventId));
  const unscheduledIds = new Set(unscheduledEvents);
  
  for (const id of allEventIds) {
    if (!scheduledIds.has(id) && !unscheduledIds.has(id)) {
      return false;
    }
  }
  
  // Check that no event is both scheduled and unscheduled
  for (const id of scheduledIds) {
    if (unscheduledIds.has(id)) {
      return false;
    }
  }
  
  // Create a copy of timeSlots to track resource usage
  const timeSlotsCopy = JSON.parse(JSON.stringify(timeSlots));
  const timeSlotMap = new Map(timeSlotsCopy.map(ts => [ts.id, ts]));
  
  // Check each scheduled event
  for (const scheduledEvent of scheduledEvents) {
    const event = events.find(e => e.id === scheduledEvent.eventId);
    const timeSlot = timeSlotMap.get(scheduledEvent.timeSlotId);
    
    if (!event || !timeSlot) {
      return false;
    }
    
    // Validate time constraints
    if (!timeEquals(scheduledEvent.startTime, timeSlot.startTime)) {
      return false;
    }
    
    const expectedEndTime = new Date(new Date(scheduledEvent.startTime).getTime() + event.duration * 60000).toISOString();
    if (!timeEquals(scheduledEvent.endTime, expectedEndTime)) {
      return false;
    }
    
    // Validate that the event fits within the time slot
    if (new Date(scheduledEvent.endTime) > new Date(timeSlot.endTime)) {
      return false;
    }
    
    // Validate resource constraints
    if (!validateResourceConstraints(event, timeSlot, resources)) {
      return false;
    }
    
    // Update resources in use for this time slot
    for (const resourceType in event.resourceRequirements) {
      timeSlot.resourcesInUse[resourceType] = 
        (timeSlot.resourcesInUse[resourceType] || 0) + 
        (event.resourceRequirements[resourceType] || 0);
    }
  }
  
  return true;
}

// Test Case 1: Example from the README
function testBasicExample() {
  const events = [
    {
      id: "e1",
      name: "Team Meeting",
      duration: 60,
      resourceRequirements: { room: 1, projector: 1 }
    },
    {
      id: "e2",
      name: "Workshop",
      duration: 120,
      resourceRequirements: { room: 1, projector: 1, whiteboard: 2 }
    },
    {
      id: "e3",
      name: "Presentation",
      duration: 45,
      resourceRequirements: { room: 1, projector: 1 }
    }
  ];

  const resources = {
    room: 2,
    projector: 2,
    whiteboard: 3
  };

  const timeSlots = [
    {
      id: "ts1",
      startTime: "2023-06-15T09:00:00",
      endTime: "2023-06-15T10:30:00",
      resourcesInUse: { room: 1, projector: 0, whiteboard: 1 }
    },
    {
      id: "ts2",
      startTime: "2023-06-15T11:00:00",
      endTime: "2023-06-15T13:30:00",
      resourcesInUse: { room: 0, projector: 1, whiteboard: 0 }
    },
    {
      id: "ts3",
      startTime: "2023-06-15T14:00:00",
      endTime: "2023-06-15T15:00:00",
      resourcesInUse: { room: 0, projector: 0, whiteboard: 0 }
    }
  ];

  const result = scheduleEvents(events, resources, timeSlots);
  
  console.assert(result.scheduledEvents.length === 3, 
    `Expected all 3 events to be scheduled, but got ${result.scheduledEvents.length}`);
  
  console.assert(result.unscheduledEvents.length === 0, 
    `Expected 0 unscheduled events, but got ${result.unscheduledEvents.length}`);
  
  console.assert(validateSchedule(result, events, resources, timeSlots), 
    "Schedule validation failed");
}

// Test Case 2: Not enough resources for all events
function testResourceConstraints() {
  const events = [
    {
      id: "e1",
      name: "Team Meeting A",
      duration: 60,
      resourceRequirements: { room: 1, projector: 1 }
    },
    {
      id: "e2",
      name: "Team Meeting B",
      duration: 60,
      resourceRequirements: { room: 1, projector: 1 }
    },
    {
      id: "e3",
      name: "Team Meeting C",
      duration: 60,
      resourceRequirements: { room: 1, projector: 1 }
    }
  ];

  const resources = {
    room: 1,
    projector: 1
  };

  const timeSlots = [
    {
      id: "ts1",
      startTime: "2023-06-15T09:00:00",
      endTime: "2023-06-15T10:30:00",
      resourcesInUse: { room: 0, projector: 0 }
    },
    {
      id: "ts2",
      startTime: "2023-06-15T11:00:00",
      endTime: "2023-06-15T12:30:00",
      resourcesInUse: { room: 0, projector: 0 }
    },
    {
      id: "ts3",
      startTime: "2023-06-15T14:00:00",
      endTime: "2023-06-15T15:30:00",
      resourcesInUse: { room: 0, projector: 0 }
    }
  ];

  const result = scheduleEvents(events, resources, timeSlots);
  
  // Should be able to schedule all 3 events since each time slot can accommodate 1 event
  console.assert(result.scheduledEvents.length === 3, 
    `Expected 3 events to be scheduled, but got ${result.scheduledEvents.length}`);
  
  console.assert(result.unscheduledEvents.length === 0, 
    `Expected 0 unscheduled events, but got ${result.unscheduledEvents.length}`);
  
  console.assert(validateSchedule(result, events, resources, timeSlots), 
    "Schedule validation failed");
}

// Test Case 3: Not enough time slots for all events
function testTimeSlotConstraints() {
  const events = [
    {
      id: "e1",
      name: "Meeting 1",
      duration: 60,
      resourceRequirements: { room: 1 }
    },
    {
      id: "e2",
      name: "Meeting 2",
      duration: 60,
      resourceRequirements: { room: 1 }
    },
    {
      id: "e3",
      name: "Meeting 3",
      duration: 60,
      resourceRequirements: { room: 1 }
    }
  ];

  const resources = {
    room: 1
  };

  const timeSlots = [
    {
      id: "ts1",
      startTime: "2023-06-15T09:00:00",
      endTime: "2023-06-15T10:00:00",
      resourcesInUse: { room: 0 }
    },
    {
      id: "ts2",
      startTime: "2023-06-15T11:00:00",
      endTime: "2023-06-15T12:00:00",
      resourcesInUse: { room: 0 }
    }
  ];

  const result = scheduleEvents(events, resources, timeSlots);
  
  // Should only be able to schedule 2 events (one in each time slot)
  console.assert(result.scheduledEvents.length === 2, 
    `Expected 2 events to be scheduled, but got ${result.scheduledEvents.length}`);
  
  console.assert(result.unscheduledEvents.length === 1, 
    `Expected 1 unscheduled event, but got ${result.unscheduledEvents.length}`);
  
  console.assert(validateSchedule(result, events, resources, timeSlots), 
    "Schedule validation failed");
}

// Test Case 4: Events with different durations
function testDifferentDurations() {
  const events = [
    {
      id: "e1",
      name: "Short Meeting",
      duration: 30,
      resourceRequirements: { room: 1 }
    },
    {
      id: "e2",
      name: "Long Meeting",
      duration: 120,
      resourceRequirements: { room: 1 }
    },
    {
      id: "e3",
      name: "Medium Meeting",
      duration: 60,
      resourceRequirements: { room: 1 }
    }
  ];

  const resources = {
    room: 1
  };

  const timeSlots = [
    {
      id: "ts1",
      startTime: "2023-06-15T09:00:00",
      endTime: "2023-06-15T09:45:00", // 45 minutes
      resourcesInUse: { room: 0 }
    },
    {
      id: "ts2",
      startTime: "2023-06-15T10:00:00",
      endTime: "2023-06-15T12:30:00", // 150 minutes
      resourcesInUse: { room: 0 }
    }
  ];

  const result = scheduleEvents(events, resources, timeSlots);
  
  // Should schedule e1 in ts1 and e2 in ts2
  console.assert(result.scheduledEvents.length === 2, 
    `Expected 2 events to be scheduled, but got ${result.scheduledEvents.length}`);
  
  console.assert(result.unscheduledEvents.length === 1, 
    `Expected 1 unscheduled event, but got ${result.unscheduledEvents.length}`);
  
  // e3 (Medium Meeting) should be unscheduled since it's too long for ts1 and would conflict with e2 in ts2
  console.assert(result.unscheduledEvents.includes("e3"), 
    `Expected e3 to be unscheduled, but got ${result.unscheduledEvents}`);
  
  console.assert(validateSchedule(result, events, resources, timeSlots), 
    "Schedule validation failed");
}

// Test Case 5: Prioritize scheduling the earliest time slot
function testEarliestTimeSlot() {
  const events = [
    {
      id: "e1",
      name: "Important Meeting",
      duration: 60,
      resourceRequirements: { room: 1 }
    }
  ];

  const resources = {
    room: 1
  };

  const timeSlots = [
    {
      id: "ts1",
      startTime: "2023-06-15T14:00:00",
      endTime: "2023-06-15T15:30:00",
      resourcesInUse: { room: 0 }
    },
    {
      id: "ts2",
      startTime: "2023-06-15T09:00:00",
      endTime: "2023-06-15T10:30:00",
      resourcesInUse: { room: 0 }
    },
    {
      id: "ts3",
      startTime: "2023-06-15T11:00:00",
      endTime: "2023-06-15T12:30:00",
      resourcesInUse: { room: 0 }
    }
  ];

  const result = scheduleEvents(events, resources, timeSlots);
  
  // Should schedule the event in the earliest time slot (ts2)
  console.assert(result.scheduledEvents.length === 1, 
    `Expected 1 event to be scheduled, but got ${result.scheduledEvents.length}`);
  
  console.assert(result.scheduledEvents[0].timeSlotId === "ts2", 
    `Expected event to be scheduled in ts2, but got ${result.scheduledEvents[0].timeSlotId}`);
  
  console.assert(validateSchedule(result, events, resources, timeSlots), 
    "Schedule validation failed");
}

// Run all tests
console.log("Running tests...");
testBasicExample();
testResourceConstraints();
testTimeSlotConstraints();
testDifferentDurations();
testEarliestTimeSlot();
console.log("All tests completed!");

# Event Scheduler

## Problem Description

You are building a scheduling system that needs to schedule a series of events, each with specific resource requirements. The system needs to assign each event to a specific time slot while ensuring that resource constraints are not violated.

## Task

Implement a function `scheduleEvents(events, resources, timeSlots)` that schedules events to time slots while respecting resource constraints.

## Input

`events`: An array of event objects, each with:

- `id`: A unique identifier for the event

- `name`: The name of the event

- `duration`: The duration of the event in minutes

- `resourceRequirements`: An object mapping resource types to the quantity required

`resources`: An object mapping resource types to the total quantity available
`timeSlots`: An array of time slot objects, each with:

- `id`: A unique identifier for the time slot

- `startTime`: The start time of the slot (ISO format: YYYY-MM-DDTHH:MM:SS)

- `endTime`: The end time of the slot (ISO format: YYYY-MM-DDTHH:MM:SS)

- `resourcesInUse`: An object mapping resource types to the quantity already in use during this slot

## Output

Return an object with:

`scheduledEvents`: An array of scheduled event objects, each with:

- `eventId`: The ID of the event

- `timeSlotId`: The ID of the assigned time slot

- `startTime`: The assigned start time for the event (ISO format)

- `endTime`: The assigned end time for the event (ISO format)

`unscheduledEvents`: An array of event IDs that could not be scheduled

## Constraints

An event can only be scheduled to a time slot if:

- The time slot duration is sufficient for the event duration

- All required resources are available during the time slot

Once an event is scheduled, the resources it uses are no longer available for other events during that time slot
If multiple time slots are suitable for an event, choose the earliest one
If not all events can be scheduled, maximize the number of scheduled events

## Example

```
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
console.log(result);
/*
Expected output:
{
  scheduledEvents: [
    {
      eventId: "e1",
      timeSlotId: "ts1",
      startTime: "2023-06-15T09:00:00",
      endTime: "2023-06-15T10:00:00"
    },
    {
      eventId: "e2",
      timeSlotId: "ts2",
      startTime: "2023-06-15T11:00:00",
      endTime: "2023-06-15T13:00:00"
    },
    {
      eventId: "e3",
      timeSlotId: "ts3",
      startTime: "2023-06-15T14:00:00",
      endTime: "2023-06-15T14:45:00"
    }
  ],
  unscheduledEvents: []
}
*/
```

## Additional Details

1. $1

2. $1

3. $1

4. $1

5. $1

## Hints

1. $1

2. $1

3. $1

4. $1

5. $1
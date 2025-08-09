# Date Range Overlap

## Problem Description

You are building a calendar application that needs to check for overlapping events. Given a list of date ranges (representing scheduled events), your task is to find all overlapping pairs of date ranges and determine the extent of their overlap.

## Task

Implement a function `findDateRangeOverlaps(dateRanges)` that takes an array of date range objects and returns an array of overlap objects.

## Input

`dateRanges`: An array of date range objects, each with:

- `id`: A unique identifier for the date range

- `start`: The start date (in ISO format: YYYY-MM-DD)

- `end`: The end date (in ISO format: YYYY-MM-DD)

- `title`: A title for the date range (optional)

## Output

Return an array of overlap objects, each with:

- `range1Id`: The ID of the first date range

- `range2Id`: The ID of the second date range

- `overlapStart`: The start date of the overlap (in ISO format: YYYY-MM-DD)

- `overlapEnd`: The end date of the overlap (in ISO format: YYYY-MM-DD)

- `overlapDays`: The number of days in the overlap (inclusive of both start and end dates)

## Example

```
const dateRanges = [
  { id: 1, start: "2023-01-15", end: "2023-01-20", title: "Team Offsite" },
  { id: 2, start: "2023-01-18", end: "2023-01-25", title: "Product Launch" },
  { id: 3, start: "2023-01-26", end: "2023-01-31", title: "Marketing Campaign" },
  { id: 4, start: "2023-01-10", end: "2023-01-16", title: "Budget Planning" }
];

const overlaps = findDateRangeOverlaps(dateRanges);
console.log(overlaps);
/*
Expected output:
[
  {
    range1Id: 1,
    range2Id: 2,
    overlapStart: "2023-01-18",
    overlapEnd: "2023-01-20",
    overlapDays: 3
  },
  {
    range1Id: 1,
    range2Id: 4,
    overlapStart: "2023-01-15",
    overlapEnd: "2023-01-16",
    overlapDays: 2
  }
]
*/
```

## Constraints

- The `dateRanges` array will contain between 0 and 1000 date ranges.

- All dates will be valid ISO format (YYYY-MM-DD).

- For any date range, the end date will be equal to or after the start date.

- The output should only include pairs where an actual overlap occurs (at least one day in common).

- Each pair of overlapping date ranges should appear exactly once in the output.

- The output order should be based on the IDs of the date ranges: first sort by `range1Id`, then by `range2Id`.

## Hints

- Two date ranges overlap if one range's start date is on or before the other range's end date, and one range's end date is on or after the other range's start date.

- Be careful with inclusive date ranges (where the start and end dates themselves are part of the range).

- Consider using Date objects for easier comparison and calculation.

- To calculate the number of days in a range, remember to include both the start and end dates in the count.
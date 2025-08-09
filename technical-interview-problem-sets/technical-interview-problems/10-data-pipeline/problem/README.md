# Data Pipeline

## Problem Description

You are tasked with implementing a data pipeline for processing streaming data. The pipeline consists of multiple stages, each with its own processing logic, and data flows through these stages in sequence. Each stage can transform the data before passing it to the next stage.

## Task

Implement a function `createDataPipeline(stages)` that creates a data pipeline from a list of processing stages. The function should return a new function that processes data through the pipeline when called.

## Input

- `stages`: An array of processing functions. Each function takes a data item as input and returns a transformed data item.

## Output

- Return a function that takes a data item as input, processes it through all stages in the pipeline, and returns the final result.

## Pipeline Behavior

1. $1

2. $1

3. $1

4. $1

5. $1

## Example

```
// Define some processing stages
const removeNulls = (data) => (data !== null && data !== undefined) ? data : null;
const multiplyByTwo = (data) => typeof data === 'number' ? data * 2 : data;
const addTen = (data) => typeof data === 'number' ? data + 10 : data;
const convertToString = (data) => data.toString();

// Create a pipeline
const pipeline = createDataPipeline([
  removeNulls,
  multiplyByTwo,
  addTen,
  convertToString
]);

// Process a single value
const result1 = pipeline(5);
console.log(result1); // "20"

// Process an array of values
const result2 = pipeline([10, null, 20, undefined, 30]);
console.log(result2); // ["30", "50", "70"]
```

## Advanced Requirements

1. $1

2. $1

3. $1

4. $1

## Example of Advanced Usage

```
// Define an asynchronous stage
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Create a pipeline with error handling
const pipeline = createDataPipeline([
  removeNulls,
  (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  },
  fetchData,
  (data) => data?.results || []
]);

// Process data
const result = await pipeline('{"url": "https://api.example.com/data"}');
console.log(result); // Array of results from the API
```

## Constraints

- The number of stages in the pipeline can be between 1 and 100.

- Each stage is a function that takes a single argument and returns a value.

- The pipeline should handle any type of data (numbers, strings, objects, arrays, etc.).

- For asynchronous stages, assume that the stage returns a Promise that resolves to the processed data.

- For error handling, you can either skip the data item or replace it with a default value (your choice).

- For parallel processing, assume that the order of the output does not need to match the order of the input.

## Hints

1. $1

2. $1

3. $1

4. $1

5. $1
const { createDataPipeline, composePipelines, createParallelPipeline } = require('./pipeline');

// Define some common processing stages for testing
const removeNulls = (data) => (data !== null && data !== undefined) ? data : null;
const multiplyByTwo = (data) => typeof data === 'number' ? data * 2 : data;
const addTen = (data) => typeof data === 'number' ? data + 10 : data;
const convertToString = (data) => data !== null && data !== undefined ? data.toString() : null;
const parseJson = (data) => {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    return null;
  }
};
const throwError = (data) => {
  throw new Error('Test error');
};

// Test Case 1: Basic pipeline with a single value
function testBasicPipelineSingleValue() {
  const pipeline = createDataPipeline([
    removeNulls,
    multiplyByTwo,
    addTen,
    convertToString
  ]);

  const result = pipeline(5);
  console.assert(result === "20", `Expected "20", got ${result}`);
}

// Test Case 2: Basic pipeline with an array of values
function testBasicPipelineArrayOfValues() {
  const pipeline = createDataPipeline([
    removeNulls,
    multiplyByTwo,
    addTen,
    convertToString
  ]);

  const result = pipeline([10, null, 20, undefined, 30]);
  console.assert(Array.isArray(result), "Expected result to be an array");
  console.assert(result.length === 3, `Expected 3 items, got ${result.length}`);
  console.assert(result[0] === "30", `Expected first item to be "30", got ${result[0]}`);
  console.assert(result[1] === "50", `Expected second item to be "50", got ${result[1]}`);
  console.assert(result[2] === "70", `Expected third item to be "70", got ${result[2]}`);
}

// Test Case 3: Pipeline with error handling
function testPipelineWithErrorHandling() {
  const pipeline = createDataPipeline([
    removeNulls,
    (data) => {
      try {
        return data.toUpperCase();
      } catch (error) {
        return null;
      }
    },
    convertToString
  ]);

  const result = pipeline([123, "hello", {}, null]);
  console.assert(Array.isArray(result), "Expected result to be an array");
  console.assert(result.length === 1, `Expected 1 item, got ${result.length}`);
  console.assert(result[0] === "HELLO", `Expected "HELLO", got ${result[0]}`);
}

// Test Case 4: Pipeline with explicit error stage
function testPipelineWithErrorStage() {
  const pipeline = createDataPipeline([
    removeNulls,
    throwError,
    convertToString
  ]);

  // This should not throw an error, but should filter out the data
  const result = pipeline(5);
  console.assert(result === null || result === undefined, 
    `Expected null or undefined, got ${result}`);
}

// Test Case 5: Empty pipeline
function testEmptyPipeline() {
  const pipeline = createDataPipeline([]);

  const result = pipeline(5);
  console.assert(result === 5, `Expected 5, got ${result}`);
}

// Test Case 6: Single stage pipeline
function testSingleStagePipeline() {
  const pipeline = createDataPipeline([multiplyByTwo]);

  const result = pipeline(5);
  console.assert(result === 10, `Expected 10, got ${result}`);
}

// Test Case 7: Pipeline with JSON parsing
function testPipelineWithJsonParsing() {
  const pipeline = createDataPipeline([
    removeNulls,
    parseJson,
    (data) => data?.value
  ]);

  const result = pipeline('{"value": 42}');
  console.assert(result === 42, `Expected 42, got ${result}`);
}

// Test Case 8: Asynchronous pipeline
async function testAsyncPipeline() {
  const asyncMultiplyByTwo = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async operation
    return typeof data === 'number' ? data * 2 : data;
  };

  const pipeline = createDataPipeline([
    removeNulls,
    asyncMultiplyByTwo,
    addTen,
    convertToString
  ]);

  const result = await pipeline(5);
  console.assert(result === "20", `Expected "20", got ${result}`);
}

// Test Case 9: Pipeline composition
function testPipelineComposition() {
  const pipeline1 = createDataPipeline([removeNulls, multiplyByTwo]);
  const pipeline2 = createDataPipeline([addTen, convertToString]);
  
  const composedPipeline = composePipelines(pipeline1, pipeline2);
  
  const result = composedPipeline(5);
  console.assert(result === "20", `Expected "20", got ${result}`);
}

// Test Case 10: Parallel pipeline
async function testParallelPipeline() {
  const delayedMultiply = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 20 - data)); // Simulate varying processing times
    return typeof data === 'number' ? data * 2 : data;
  };
  
  const pipeline = createParallelPipeline([
    removeNulls,
    delayedMultiply,
    addTen,
    convertToString
  ], 2); // Process up to 2 items in parallel
  
  const result = await pipeline([5, 10, 15]);
  
  console.assert(Array.isArray(result), "Expected result to be an array");
  console.assert(result.length === 3, `Expected 3 items, got ${result.length}`);
  
  // Check that all expected values are in the result (order may vary)
  console.assert(result.includes("20"), `Expected "20" to be in result: ${result}`);
  console.assert(result.includes("30"), `Expected "30" to be in result: ${result}`);
  console.assert(result.includes("40"), `Expected "40" to be in result: ${result}`);
}

// Run all tests
async function runTests() {
  console.log("Running tests...");
  testBasicPipelineSingleValue();
  testBasicPipelineArrayOfValues();
  testPipelineWithErrorHandling();
  testPipelineWithErrorStage();
  testEmptyPipeline();
  testSingleStagePipeline();
  testPipelineWithJsonParsing();
  await testAsyncPipeline();
  testPipelineComposition();
  await testParallelPipeline();
  console.log("All tests completed!");
}

// Run the tests
runTests().catch(console.error);

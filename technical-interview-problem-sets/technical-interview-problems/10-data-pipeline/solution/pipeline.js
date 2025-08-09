/**
 * Create a data pipeline from a list of processing stages.
 * 
 * @param {Array} stages - Array of processing functions
 * @return {Function} A function that processes data through the pipeline
 */
function createDataPipeline(stages) {
  // If no stages are provided, return a function that simply returns the input
  if (!stages || stages.length === 0) {
    return (data) => data;
  }
  
  // Return a function that processes data through the pipeline
  return async function(data) {
    // If data is an array, process each item individually
    if (Array.isArray(data)) {
      const results = [];
      
      // Process each item in the array
      const promises = data.map(item => processThroughPipeline(item, stages));
      const processedItems = await Promise.all(promises);
      
      // Filter out null/undefined values
      for (const item of processedItems) {
        if (item !== null && item !== undefined) {
          results.push(item);
        }
      }
      
      return results;
    }
    
    // Process a single item through the pipeline
    return processThroughPipeline(data, stages);
  };
}

/**
 * Process a single data item through the pipeline stages.
 * 
 * @param {*} data - The data item to process
 * @param {Array} stages - Array of processing functions
 * @return {*} The processed data
 */
async function processThroughPipeline(data, stages) {
  let result = data;
  
  // Process the data through each stage
  for (const stage of stages) {
    // Skip processing if result is null/undefined
    if (result === null || result === undefined) {
      return null;
    }
    
    try {
      // Apply the current stage to the result
      const stageResult = stage(result);
      
      // If the stage returns a Promise, await it
      if (stageResult instanceof Promise) {
        result = await stageResult;
      } else {
        result = stageResult;
      }
    } catch (error) {
      // If an error occurs, skip this data item
      return null;
    }
  }
  
  return result;
}

/**
 * Create a new pipeline by connecting two existing pipelines.
 * 
 * @param {Function} pipeline1 - The first pipeline
 * @param {Function} pipeline2 - The second pipeline
 * @return {Function} A new pipeline that is the composition of the two pipelines
 */
function composePipelines(pipeline1, pipeline2) {
  return async function(data) {
    // Process data through the first pipeline
    const intermediateResult = await pipeline1(data);
    
    // Process the result through the second pipeline
    return pipeline2(intermediateResult);
  };
}

/**
 * Process chunks of data in parallel with a concurrency limit.
 * 
 * @param {Array} data - Array of data items to process
 * @param {Function} processor - Function to process each item
 * @param {number} concurrency - Maximum number of items to process in parallel
 * @return {Array} The processed data
 */
async function processInParallel(data, processor, concurrency) {
  const results = [];
  
  // Process data in chunks to respect the concurrency limit
  for (let i = 0; i < data.length; i += concurrency) {
    const chunk = data.slice(i, i + concurrency);
    const chunkPromises = chunk.map(item => processor(item));
    const chunkResults = await Promise.all(chunkPromises);
    
    // Add chunk results to the overall results
    results.push(...chunkResults);
  }
  
  return results;
}

/**
 * Create a parallel pipeline that processes data with a concurrency limit.
 * 
 * @param {Array} stages - Array of processing functions
 * @param {number} concurrency - Maximum number of items to process in parallel
 * @return {Function} A function that processes data through the pipeline in parallel
 */
function createParallelPipeline(stages, concurrency) {
  // Create a regular pipeline
  const pipeline = createDataPipeline(stages);
  
  // Return a function that processes data in parallel
  return async function(data) {
    // If data is not an array, process it directly
    if (!Array.isArray(data)) {
      return pipeline(data);
    }
    
    // Process the array in parallel with the concurrency limit
    const results = await processInParallel(data, item => pipeline(item), concurrency);
    
    // Filter out null/undefined values
    return results.filter(item => item !== null && item !== undefined);
  };
}

module.exports = {
  createDataPipeline,
  composePipelines,
  createParallelPipeline
};

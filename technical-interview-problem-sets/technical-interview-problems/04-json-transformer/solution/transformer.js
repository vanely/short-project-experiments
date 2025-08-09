/**
 * Transform a JSON object according to the provided transformation rules.
 * 
 * @param {Object} input - The input JSON object to transform
 * @param {Array} transformationRules - Array of transformation rule objects
 * @return {Object} The transformed JSON object
 */
function transformJson(input, transformationRules) {
  // Create a deep copy of the input to avoid modifying the original
  const result = JSON.parse(JSON.stringify(input));
  
  // Apply each transformation rule in order
  for (const rule of transformationRules) {
    switch (rule.type) {
      case "rename":
        renameField(result, rule);
        break;
      case "format":
        formatField(result, rule);
        break;
      case "restructure":
        restructureField(result, rule);
        break;
      case "filter":
        filterArray(result, rule);
        break;
      case "calculate":
        calculateField(result, rule);
        break;
    }
  }
  
  return result;
}

/**
 * Renames a field in the JSON object.
 */
function renameField(obj, rule) {
  const value = getNestedProperty(obj, rule.from);
  if (value !== undefined) {
    setNestedProperty(obj, rule.to, value);
    deleteNestedProperty(obj, rule.from);
  }
}

/**
 * Formats a field according to the specified format type.
 */
function formatField(obj, rule) {
  const value = getNestedProperty(obj, rule.field);
  if (value === undefined) return;
  
  let formattedValue;
  
  switch (rule.formatType) {
    case "uppercase":
      formattedValue = String(value).toUpperCase();
      break;
    case "lowercase":
      formattedValue = String(value).toLowerCase();
      break;
    case "date":
      formattedValue = formatDate(value);
      break;
    case "number":
      formattedValue = Number(Number(value).toFixed(2));
      break;
  }
  
  setNestedProperty(obj, rule.field, formattedValue);
}

/**
 * Formats a date string from MM/DD/YYYY to YYYY-MM-DD.
 */
function formatDate(dateStr) {
  const [month, day, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Moves a field to a new nested location without deleting the original.
 */
function restructureField(obj, rule) {
  const value = getNestedProperty(obj, rule.from);
  if (value !== undefined) {
    setNestedProperty(obj, rule.to, value);
    deleteNestedProperty(obj, rule.from);
  }
}

/**
 * Filters an array based on a condition.
 */
function filterArray(obj, rule) {
  const array = getNestedProperty(obj, rule.field);
  if (!Array.isArray(array)) return;
  
  const condition = rule.condition;
  const filteredArray = array.filter(item => {
    const fieldValue = getNestedProperty(item, condition.field);
    
    switch (condition.operator) {
      case "eq":
        return fieldValue === condition.value;
      case "gt":
        return fieldValue > condition.value;
      case "lt":
        return fieldValue < condition.value;
      case "contains":
        return String(fieldValue).includes(condition.value);
      default:
        return false;
    }
  });
  
  setNestedProperty(obj, rule.field, filteredArray);
}

/**
 * Calculates a new field based on an operation on an array.
 */
function calculateField(obj, rule) {
  const array = getNestedProperty(obj, rule.sourceField);
  if (!Array.isArray(array) || array.length === 0) {
    setNestedProperty(obj, rule.targetField, rule.operation === "count" ? 0 : null);
    return;
  }
  
  let result;
  
  switch (rule.operation) {
    case "sum":
      result = array.reduce((sum, item) => {
        const value = rule.valueField ? getNestedProperty(item, rule.valueField) : item;
        return sum + (Number(value) || 0);
      }, 0);
      // Round to 2 decimal places for monetary values
      result = Number(result.toFixed(2));
      break;
      
    case "average":
      result = array.reduce((sum, item) => {
        const value = rule.valueField ? getNestedProperty(item, rule.valueField) : item;
        return sum + (Number(value) || 0);
      }, 0) / array.length;
      // Round to 2 decimal places
      result = Number(result.toFixed(2));
      break;
      
    case "min":
      result = array.reduce((min, item) => {
        const value = rule.valueField ? getNestedProperty(item, rule.valueField) : item;
        return Math.min(min, Number(value) || 0);
      }, Infinity);
      break;
      
    case "max":
      result = array.reduce((max, item) => {
        const value = rule.valueField ? getNestedProperty(item, rule.valueField) : item;
        return Math.max(max, Number(value) || 0);
      }, -Infinity);
      break;
      
    case "count":
      result = array.length;
      break;
  }
  
  setNestedProperty(obj, rule.targetField, result);
}

/**
 * Gets a nested property using dot notation.
 */
function getNestedProperty(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    // Handle array indexing
    if (/^\d+$/.test(part) && Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (index >= current.length) {
        return undefined;
      }
      current = current[index];
    } else {
      current = current[part];
    }
  }
  
  return current;
}

/**
 * Sets a nested property using dot notation, creating intermediate objects as needed.
 */
function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    // Handle array indexing
    if (/^\d+$/.test(part) && Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (index >= current.length) {
        // Extend the array if needed
        current.length = index + 1;
      }
      if (current[index] === undefined || current[index] === null) {
        current[index] = {};
      }
      current = current[index];
    } else {
      if (current[part] === undefined || current[part] === null) {
        current[part] = {};
      }
      current = current[part];
    }
  }
  
  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

/**
 * Deletes a nested property using dot notation.
 */
function deleteNestedProperty(obj, path) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    if (current === null || current === undefined) {
      return;
    }
    
    // Handle array indexing
    if (/^\d+$/.test(part) && Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (index >= current.length) {
        return;
      }
      current = current[index];
    } else {
      if (!(part in current)) {
        return;
      }
      current = current[part];
    }
  }
  
  const lastPart = parts[parts.length - 1];
  delete current[lastPart];
  
  // Clean up empty objects
  if (Object.keys(current).length === 0 && parts.length > 1) {
    deleteNestedProperty(obj, parts.slice(0, -1).join('.'));
  }
}

module.exports = {
  transformJson
};

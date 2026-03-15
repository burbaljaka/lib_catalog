/**
 * Convert camelCase keys to snake_case for API request params.
 */
export function toSnakeParams(params) {
  if (params == null) return {};
  const result = {};
  for (const [key, value] of Object.entries(params)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

/**
 * Recursively convert snake_case keys to camelCase in objects and arrays.
 */
export function toCamelResponse(data) {
  if (data == null) return data;
  if (Array.isArray(data)) {
    return data.map((item) => toCamelResponse(item));
  }
  if (typeof data === 'object' && data.constructor === Object) {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelResponse(value);
    }
    return result;
  }
  return data;
}

/**
 * Common Utility Functions
 *
 * Collection of general-purpose utilities used across the application.
 * These functions provide common functionality that doesn't fit into
 * other specialized modules.
 */

/**
 * Mask sensitive API key for display
 *
 * Obfuscates an API key by replacing all but the last 4 characters with asterisks.
 * Preserves a consistent masked format for security while providing a way to
 * distinguish between different keys.
 *
 * @param key - The API key to mask
 * @returns Masked key with only the last 4 characters visible
 */
export function maskApiKey(key: string): string {
  if (key.length <= 4) return '****';
  return `****${key.slice(-4)}`;
}

/**
 * Safely stringify an object to JSON
 *
 * Converts an object to a JSON string with error handling.
 *
 * @param obj - The object to stringify
 * @param fallback - Optional fallback value if stringification fails
 * @returns JSON string or fallback value
 */
export function safeStringify<T>(obj: T, fallback = '{}'): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Failed to stringify object:', formatError(error));
    return fallback;
  }
}

/**
 * Safely parse a JSON string to an object
 *
 * Converts a JSON string to an object with error handling.
 *
 * @param str - The JSON string to parse
 * @param fallback - Optional fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export function safeParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    console.error('Failed to parse JSON string:', formatError(error));
    return fallback;
  }
}

/**
 * Generate a unique request ID
 *
 * Creates a unique identifier for logging and tracking purposes.
 *
 * @returns Unique ID string
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

/**
 * Format error to string
 *
 * Consistently formats various error types to string.
 *
 * @param error - The error to format
 * @returns Formatted error string
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || `${error.name}: ${error.message}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  return safeStringify(error, 'Unknown error');
}

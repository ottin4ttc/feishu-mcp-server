import { formatError } from '../error/format.js';

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
    console.error(
      'Failed to stringify object:',
      formatError(error, { includeStack: true }),
    );
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
    console.error(
      'Failed to parse JSON string:',
      formatError(error, { includeStack: true }),
    );
    return fallback;
  }
}

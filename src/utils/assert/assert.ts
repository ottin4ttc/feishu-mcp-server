/**
 * Assert a condition is true
 *
 * @param condition - The condition to check
 * @param message - Optional error message
 * @throws Error if condition is false
 */
export function assert(
  condition: boolean,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

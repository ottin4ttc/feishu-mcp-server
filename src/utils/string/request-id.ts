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

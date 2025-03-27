import type { AxiosError } from 'axios';
import { safeStringify } from '../object/json.js';

/**
 * Format error to string or structured object
 *
 * Consistently formats various error types with enhanced support for:
 * - Standard Error objects
 * - Axios errors with HTTP details
 * - String errors
 * - Unknown error types
 *
 * @param error - The error to format
 * @param options - Formatting options
 * @returns Formatted error string or object
 */
export function formatError(
  error: unknown,
  options: {
    /** Whether to return structured object instead of string */
    structured?: boolean;
    /** Whether to include stack trace if available */
    includeStack?: boolean;
  } = {},
): string | Record<string, unknown> {
  // Handle Axios errors
  if (
    error &&
    typeof error === 'object' &&
    'isAxiosError' in error &&
    error.isAxiosError
  ) {
    const axiosError = error as AxiosError;
    const errorInfo = {
      type: 'AxiosError',
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      data: axiosError.response?.data,
    };

    return options.structured ? errorInfo : safeStringify(errorInfo);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const errorInfo = {
      type: error.name,
      message: error.message,
      stack: options.includeStack ? error.stack : undefined,
    };

    return options.structured
      ? errorInfo
      : options.includeStack
        ? error.stack || `${error.name}: ${error.message}`
        : `${error.name}: ${error.message}`;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return options.structured ? { type: 'String', message: error } : error;
  }

  // Handle unknown error types
  const fallback = 'Unknown error';
  return options.structured
    ? { type: 'Unknown', data: error || fallback }
    : safeStringify(error, fallback);
}

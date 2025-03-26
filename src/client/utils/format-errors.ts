import { AxiosError } from '@/http/index.js';
import { get, pick } from '@/utils/index.js';

/**
 * Format error objects for logging
 *
 * Extracts and formats relevant information from error objects,
 * with special handling for Axios errors
 *
 * @param e - Error to format
 * @returns Formatted error information as an array
 */
export const formatErrors = (e: unknown): unknown[] => {
  if (e instanceof AxiosError) {
    const { message, response, request, config } = pick(e, [
      'message',
      'response',
      'request',
      'config',
    ]);

    // Extract only relevant parts of the error for logging
    const filteredErrorInfo = {
      message,
      config: pick(config, ['data', 'url', 'params', 'method']),
      request: pick(request, ['protocol', 'host', 'path', 'method']),
      response: pick(response, ['data', 'status', 'statusText']),
    };

    const errors = [filteredErrorInfo];

    // Add specific error details from the response if available
    const specificError = get(e, 'response.data');
    if (specificError) {
      errors.push({
        ...specificError,
        ...(specificError.error ? specificError.error : {}),
      });
    }

    return errors;
  }

  return [e];
};

import { AxiosError } from 'axios';

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
    const errorInfo = {
      message: e.message,
      status: e.response?.status,
      statusText: e.response?.statusText,
      url: e.config?.url,
      method: e.config?.method,
      data: e.response?.data,
    };

    return [errorInfo];
  }

  return [e];
};

/**
 * API Interceptors for logging and error handling
 */
import { formatError } from '@/common.js';
import type { Logger } from '@/typings/index.js';
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError, type ApiResponse } from './types.js';

export function createRequestInterceptor(logger: Logger) {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (logger.trace) {
      const method = config.method?.toUpperCase() || 'UNKNOWN';
      const url = config.url || 'unknown-url';
      const hasParams = config.params && Object.keys(config.params).length > 0;
      const hasData =
        config.data &&
        (typeof config.data === 'object'
          ? Object.keys(config.data).length > 0
          : true);

      logger.trace(
        `Sending ${method} request to ${url}${hasParams ? ' with params' : ''}${hasData ? ' with data' : ''}`,
      );
    }

    return config;
  };
}

export function createResponseSuccessInterceptor() {
  return (response: AxiosResponse): AxiosResponse => {
    const apiResponse = response.data as ApiResponse<unknown>;

    if (
      typeof apiResponse === 'object' &&
      apiResponse !== null &&
      apiResponse.code !== 0
    ) {
      throw new ApiError(
        apiResponse.code,
        apiResponse.msg || `API Error: ${apiResponse.code}`,
      );
    }

    return response;
  };
}

export function createResponseErrorInterceptor(logger: Logger) {
  return (error: unknown): Promise<never> => {
    if (logger.error) {
      if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        const statusText = axiosError.response?.statusText;
        const url = axiosError.config?.url;
        const method = axiosError.config?.method?.toUpperCase();

        logger.error(
          `Request failed: ${method} ${url} - ${status} ${statusText}`,
          axiosError.response?.data || axiosError.message,
        );
      } else {
        logger.error(`Request failed: ${formatError(error)}`);
      }
    }

    return Promise.reject(error);
  };
}

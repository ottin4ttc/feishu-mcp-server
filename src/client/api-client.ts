import { API_ENDPOINT } from '@/consts/index.js';
import { formatError } from '@/utils/error/format.js';
import { assert, formatUrl, internalCache } from '@/utils/index.js';
/**
 * Unified FeiShu API Client
 *
 * Uses only FeiShu endpoint implementation, simplifying configuration and implementation
 */
import axios from 'axios';
import { stringify } from 'qs';
import {
  createRequestInterceptor,
  createResponseErrorInterceptor,
  createResponseSuccessInterceptor,
} from './interceptors.js';
import { TokenManager } from './token-manager.js';

import type { Cache, Logger } from '@/typings/index.js';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  ApiClientConfig,
  ApiResponse,
  PaginationOptions,
  Payload,
  RequestOptions,
} from './types.js';
import { ApiError } from './types.js';

/**
 * Unified FeiShu API Client
 */
export class ApiClient {
  protected domain = API_ENDPOINT;
  protected appId!: string;
  protected appSecret!: string;
  protected cache!: Cache;
  protected disableTokenCache?: boolean;
  protected tokenManager!: TokenManager;
  protected logger!: Logger;
  protected httpInstance!: AxiosInstance;

  /**
   * Create new API client
   */
  constructor(config: ApiClientConfig) {
    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.logger = config.logger;
    this.cache = config.cache || (internalCache as unknown as Cache);
    this.disableTokenCache = config.disableTokenCache;

    this.initializeHttpInstance();
    this.initializeTokenManager();
  }

  /**
   * Initialize HTTP client instance
   */
  protected initializeHttpInstance(): void {
    // Create axios instance
    this.httpInstance = axios.create({
      baseURL: this.domain,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'feishu-mcp-server/0.0.1',
      },
      // Configure global parameter serializer
      paramsSerializer: {
        serialize: (params) => stringify(params, { arrayFormat: 'repeat' }),
      },
    });

    // Add interceptors
    this.httpInstance.interceptors.request.use(
      createRequestInterceptor(this.logger),
    );

    // Add response interceptors
    this.httpInstance.interceptors.response.use(
      createResponseSuccessInterceptor(),
      createResponseErrorInterceptor(this.logger),
    );
  }

  /**
   * Initialize token manager
   */
  protected initializeTokenManager(): void {
    this.tokenManager = new TokenManager({
      appId: this.appId,
      appSecret: this.appSecret,
      cache: this.cache,
      logger: this.logger,
      httpInstance: this.httpInstance,
    });
  }

  /**
   * Convert pagination parameters to request parameters
   */
  protected convertPaginationParams(
    pagination?: PaginationOptions,
    params: Record<string, unknown> = {},
  ): Record<string, unknown> {
    if (!pagination) return params;

    const result = { ...params };
    if (pagination.pageSize !== undefined)
      result.page_size = pagination.pageSize;
    if (pagination.pageToken) result.page_token = pagination.pageToken;

    return result;
  }

  /**
   * Send GET request
   */
  protected async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        url,
        method: 'GET',
        params,
      },
      options,
    );
  }

  /**
   * Send paginated GET request
   */
  protected async getList<T = unknown>(
    url: string,
    pagination?: PaginationOptions,
    additionalParams?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    // Merge pagination parameters and additional parameters
    const params = this.convertPaginationParams(pagination, additionalParams);

    return this.request<T>(
      {
        url,
        method: 'GET',
        params,
      },
      options,
    );
  }

  /**
   * Send POST request
   */
  protected async post<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        url,
        method: 'POST',
        data,
        params,
      },
      options,
    );
  }

  /**
   * Send PUT request
   */
  protected async put<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        url,
        method: 'PUT',
        data,
        params,
      },
      options,
    );
  }

  /**
   * Send DELETE request
   */
  protected async delete<T = unknown>(
    url: string,
    data?: unknown,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      {
        url,
        method: 'DELETE',
        data,
        params,
      },
      options,
    );
  }

  /**
   * Add authorization information to request
   */
  protected async addAuthorizationHeader(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<AxiosRequestConfig> {
    // Create new request config object to avoid modifying the original
    const newConfig = { ...config };

    const targetOptions: Required<RequestOptions> = {
      params: options?.params || {},
      data: options?.data || {},
      headers: options?.headers || {},
      path: options?.path || {},
    };

    // Get token and add authorization header
    const tenantAccessToken = await this.tokenManager.getTenantAccessToken();

    if (tenantAccessToken) {
      newConfig.headers = newConfig.headers || {};
      newConfig.headers.Authorization = `Bearer ${tenantAccessToken}`;
    } else {
      this.logger.warn('Failed to get token');
    }

    // Merge request options
    if (Object.keys(targetOptions.params).length > 0) {
      newConfig.params = { ...newConfig.params, ...targetOptions.params };
    }

    if (Object.keys(targetOptions.data).length > 0) {
      newConfig.data = { ...newConfig.data, ...targetOptions.data };
    }

    return newConfig;
  }

  /**
   * Send authenticated request to API
   */
  protected async request<T = unknown>(
    config: AxiosRequestConfig,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      // Add authorization header
      const authenticatedConfig = await this.addAuthorizationHeader(
        config,
        options,
      );

      // Record request
      if (this.logger.trace) {
        this.logger.trace(`Sending request [${config.method}]: ${config.url}`);
      }

      // Use axios instance to send request
      const response = await this.httpInstance.request<
        unknown,
        AxiosResponse<ApiResponse<T>>
      >({
        ...authenticatedConfig,
      });

      // Return response data
      return response.data;
    } catch (error) {
      // If already ApiError, throw directly
      if (error instanceof ApiError) {
        throw error;
      }

      // Other error handling
      this.logger.error(
        `API request failed: ${config.method} ${config.url}`,
        formatError(error, { structured: true }),
      );
      throw error;
    }
  }
}

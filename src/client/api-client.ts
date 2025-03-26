import { formatError } from '@/common.js';
import { CTenantKey } from '@/consts/index.js';
import { defaultLogger } from '@/logger/default-logger.js';
import { LoggerProxy } from '@/logger/logger-proxy.js';
import type { HttpInstance } from '@/typings/http.js';
import { Domain, LoggerLevel } from '@/typings/index.js';
import type { Cache, Logger } from '@/typings/index.js';
import {
  assert,
  formatDomain,
  formatUrl,
  get,
  internalCache,
} from '@/utils/index.js';
/**
 * Unified API Client for FeiShu
 *
 * Provides standardized implementation for API endpoints
 */
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import { TokenManager } from './token-manager.js';
import type { IClientParams, IPayload, IRequestOptions } from './types.js';
import { formatErrors } from './utils/index.js';

/**
 * API endpoints configuration
 */
export enum ApiEndpoint {
  FEISHU = 'https://open.feishu.cn',
  LARK = 'https://open.larksuite.com',
}

/**
 * API response structure
 */
export interface ApiResponse<T = unknown> {
  code: number;
  msg?: string;
  data?: T;
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  appId: string;
  appSecret: string;
  endpoint?: ApiEndpoint;
  logger?: Logger;
  cache?: Cache;
  disableTokenCache?: boolean;
}

/**
 * Unified API client for FeiShu services
 */
export class ApiClient {
  protected appId!: string;
  protected appSecret!: string;
  protected cache!: Cache;
  protected disableTokenCache?: boolean;
  protected tokenManager!: TokenManager;
  protected domain!: string;
  protected logger!: LoggerProxy | Logger;
  protected httpInstance!: HttpInstance | AxiosInstance;

  /**
   * Create a new API client
   */
  constructor(config: ApiClientConfig) {
    // Initialize with legacy ApiClientConfig
    this.initializeWithApiClientConfig(config);
  }

  /**
   * Initialize with legacy ApiClientConfig format
   */
  protected initializeWithApiClientConfig(config: ApiClientConfig) {
    this.appId = config.appId;
    this.appSecret = config.appSecret;
    this.domain = config.endpoint || ApiEndpoint.FEISHU;
    this.logger = config.logger || defaultLogger;
    this.cache = config.cache || {
      set: async () => true,
      get: async () => null,
    };
    this.disableTokenCache = config.disableTokenCache;

    // Create axios instance with base configuration
    this.httpInstance = axios.create({
      baseURL: this.domain,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'feishu-mcp-server/0.0.1',
      },
    });

    // Add response interceptor if using axios
    if ('interceptors' in this.httpInstance) {
      this.httpInstance.interceptors.response.use(
        (response) => response.data,
        (error) => {
          this.logger.error('API request failed:', formatError(error));
          throw error;
        },
      );
    }

    // Initialize token manager
    this.initializeTokenManager();
  }

  /**
   * Initialize token manager for authentication
   */
  protected initializeTokenManager() {
    this.tokenManager = new TokenManager({
      appId: this.appId,
      appSecret: this.appSecret,
      cache: this.cache,
      domain: this.domain,
      logger: this.logger,
      httpInstance: this.httpInstance,
    });
  }

  /**
   * Create a parameter serializer for requests
   *
   * @returns Parameter serializer function
   */
  protected createParamsSerializer() {
    return (params: Record<string, unknown>) =>
      stringify(params, { arrayFormat: 'repeat' });
  }

  /**
   * Handle request errors with proper logging
   *
   * @param error - Error object
   * @throws The original error after logging
   */
  protected handleRequestError(error: unknown): never {
    this.logger.error(formatErrors(error));
    throw error;
  }

  /**
   * Send authenticated request to the API
   *
   * @param config Request configuration
   * @returns API response
   */
  protected async request<T = unknown>(
    config: AxiosRequestConfig,
    options?: IRequestOptions,
  ): Promise<ApiResponse<T>> {
    try {
      // Get token and add authorization header
      const token = await this.tokenManager.getTenantAccessToken(
        options?.lark
          ? { [CTenantKey]: get(options.lark, CTenantKey) }
          : undefined,
      );

      const headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };

      if (this.logger instanceof LoggerProxy) {
        this.logger.trace(`send request [${config.method}]: ${config.url}`);
      }

      // Make request with authorization
      if ('interceptors' in this.httpInstance) {
        // 使用axios实例
        const axiosInstance = this.httpInstance as AxiosInstance;
        return await axiosInstance.request<unknown, ApiResponse<T>>({
          ...config,
          headers,
          paramsSerializer: (params) => this.createParamsSerializer()(params),
        });
      }

      // 处理非axios的httpInstance实例
      const { data, params, url, ...rest } = config;

      return await (this.httpInstance as HttpInstance).request<
        unknown,
        ApiResponse<T>
      >({
        ...rest,
        url:
          url && /^http/.test(url as string)
            ? url
            : `${this.domain}/${formatUrl((url as string) || '')}`,
        headers,
        data,
        params,
      });
    } catch (error) {
      this.logger.error(
        `API request failed: ${config.method} ${config.url}`,
        formatErrors(error),
      );
      throw error;
    }
  }
}

/**
 * Legacy Client class for backward compatibility
 *
 * @deprecated Use ApiClient instead
 */
export class Client extends ApiClient {
  /**
   * Create new FeiShu API client
   *
   * @param params - Client parameters including credentials
   */
  constructor(params: IClientParams) {
    super({
      appId: params.appId,
      appSecret: params.appSecret,
      endpoint: params.domain as ApiEndpoint,
      logger: params.logger,
      cache: params.cache,
      disableTokenCache: params.disableTokenCache,
    });

    if (params.httpInstance) {
      this.httpInstance = params.httpInstance;
    }

    // Convert logger to LoggerProxy if needed
    if (!(this.logger instanceof LoggerProxy)) {
      this.logger = new LoggerProxy(
        params.loggerLevel || LoggerLevel.info,
        params.logger || defaultLogger,
      );
    }

    this.logger.info('client ready');
  }

  /**
   * Format request payload with authorization and options
   *
   * @param payload - Request payload
   * @param options - Request options
   * @returns Formatted payload
   */
  async formatPayload(
    payload?: IPayload,
    options?: IRequestOptions,
  ): Promise<Required<IPayload>> {
    const targetOptions = this.extractTargetOptions(options);
    await this.setAuthorizationHeader(targetOptions);

    return {
      params: { ...get(payload, 'params', {}), ...targetOptions.params },
      headers: {
        'User-Agent': 'feishu-mcp-server/0.0.1',
        ...get(payload, 'headers', {}),
        ...targetOptions.headers,
      },
      data: { ...get(payload, 'data', {}), ...targetOptions.data },
      path: {
        ...get(payload, 'path', {}),
        ...targetOptions.path,
      },
    };
  }

  /**
   * Extract and normalize request options
   *
   * @param options - Request options
   * @returns Normalized options
   */
  private extractTargetOptions(
    options?: IRequestOptions,
  ): Required<IRequestOptions> {
    return ['lark', 'params', 'data', 'headers', 'path'].reduce(
      (acc, key) => {
        acc[key as keyof Required<IRequestOptions>] = get(options, key, {});
        return acc;
      },
      {} as Required<IRequestOptions>,
    );
  }

  /**
   * Set authorization header using tokenManager
   *
   * @param targetOptions - Request options
   */
  private async setAuthorizationHeader(
    targetOptions: Required<IRequestOptions>,
  ) {
    const tenantAccessToken = await this.tokenManager.getTenantAccessToken({
      [CTenantKey]: get(targetOptions.lark, CTenantKey),
    });
    if (tenantAccessToken) {
      targetOptions.headers.Authorization = `Bearer ${tenantAccessToken}`;
    } else {
      this.logger.warn('failed to obtain token');
    }
  }

  /**
   * Legacy request method for backward compatibility
   */
  async request<T = unknown>(
    payload: AxiosRequestConfig,
    options?: IRequestOptions,
  ) {
    const { data, params, headers, url, ...rest } = payload;
    const formatPayload = await this.formatPayload(
      {
        data,
        params,
        headers,
      },
      options,
    );

    // Call super class request method
    return super.request<T>(
      {
        ...rest,
        url,
        headers: formatPayload.headers,
        data: formatPayload.data,
        params: formatPayload.params,
      },
      options,
    );
  }
}

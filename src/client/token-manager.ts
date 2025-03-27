import { TENANT_ACCESS_TOKEN } from '@/consts/index.js';
import type { Cache, Logger } from '@/typings/index.js';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import type { TokenManagerParams, TokenResponse } from './types.js';

/**
 * Manages authentication tokens for FeiShu API
 *
 * Handles token fetching, caching, and renewal
 */
export class TokenManager {
  private readonly appId: string;
  private readonly appSecret: string;
  private cache: Cache;
  private logger: Logger;
  private httpInstance: AxiosInstance;

  /**
   * Create a new token manager
   *
   * @param params - Configuration parameters
   */
  constructor(params: TokenManagerParams) {
    const { appId, appSecret, cache, logger, httpInstance } = params;
    this.appId = appId;
    this.appSecret = appSecret;
    this.cache = cache;
    this.logger = logger;
    this.httpInstance = httpInstance;
    this.logger.debug('token manager is ready');
  }

  /**
   * Fetch tenant access token from FeiShu API
   *
   * @returns Token response with access token and expiration time
   * @throws Error if the request fails or the response is invalid
   */
  private async fetchTenantAccessToken(): Promise<TokenResponse> {
    try {
      const response = await this.httpInstance.post<
        unknown,
        AxiosResponse<TokenResponse>
      >('/open-apis/auth/v3/tenant_access_token/internal', {
        app_id: this.appId,
        app_secret: this.appSecret,
      });

      const data = response.data;

      // Check if response data is valid
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid token response format');
      }

      // Check if error code exists
      if (data.code && data.code !== 0) {
        throw new Error(
          `Failed to get token: ${data.msg || `Error code: ${data.code}`}`,
        );
      }

      // Check if required fields exist
      if (!data.tenant_access_token || !data.expire) {
        throw new Error('Missing required fields in token response');
      }

      return data;
    } catch (error) {
      // Enhanced error logging
      if ((error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;
        this.logger.error(
          `Token request failed: ${axiosError.message}`,
          axiosError.response?.data || axiosError.response?.status,
        );
      } else {
        this.logger.error(
          `Token error: ${(error as Error).message || String(error)}`,
        );
      }
      throw new Error('Failed to fetch tenant access token');
    }
  }

  /**
   * Cache tenant access token
   *
   * Stores token in cache with expiration time (3 minutes before actual expiry)
   *
   * @param token - Access token
   * @param expire - Expiration time in seconds
   */
  private async cacheTenantAccessToken(
    token: string,
    expire: number,
  ): Promise<void> {
    // Expire 3 minutes early to avoid edge cases
    const expirationTime = new Date().getTime() + (expire - 180) * 1000;

    try {
      await this.cache.set(TENANT_ACCESS_TOKEN, token, expirationTime, {
        namespace: this.appId,
      });
      this.logger.debug(
        `Token cached until ${new Date(expirationTime).toISOString()}`,
      );
    } catch (error) {
      // Cache failure doesn't affect current operation, but needs to be logged
      this.logger.warn(
        `Failed to cache token: ${(error as Error).message || String(error)}`,
      );
    }
  }

  /**
   * Get tenant access token with caching
   *
   * Retrieves token from cache or fetches a new one if necessary
   *
   * @returns Access token
   */
  async getCustomTenantAccessToken(): Promise<string> {
    try {
      // Try to get from cache
      const cachedToken = await this.cache.get(TENANT_ACCESS_TOKEN, {
        namespace: this.appId,
      });

      if (cachedToken && typeof cachedToken === 'string') {
        this.logger.debug('Using cached tenant access token');
        return cachedToken;
      }
    } catch (error) {
      // Cache read error, log but don't block, continue to get new token
      this.logger.warn(
        `Cache error: ${(error as Error).message || String(error)}`,
      );
    }

    // No token in cache or read failed, request new token
    this.logger.debug('Requesting new tenant access token');
    const { tenant_access_token, expire } = await this.fetchTenantAccessToken();

    // Asynchronously cache token
    this.cacheTenantAccessToken(tenant_access_token, expire).catch((err) => {
      this.logger.error(`Failed to cache token: ${err.message}`);
    });

    return tenant_access_token;
  }

  /**
   * Get tenant access token
   *
   * Main token retrieval method that applications should use
   *
   * @returns Access token
   */
  async getTenantAccessToken(): Promise<string> {
    this.logger.debug('Getting tenant access token');
    return await this.getCustomTenantAccessToken();
  }
}

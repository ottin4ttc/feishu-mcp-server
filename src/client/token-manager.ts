import { CTenantAccessToken, CTenantKey } from '@/consts/index.js';
import type { HttpInstance } from '@/typings/http.js';
import type { Cache, Logger } from '@/typings/index.js';

/**
 * TokenManager parameters
 */
interface TokenManagerParams {
  /** FeiShu App ID */
  appId: string;
  /** FeiShu App Secret */
  appSecret: string;
  /** Cache implementation */
  cache: Cache;
  /** API domain */
  domain: string;
  /** Logger instance */
  logger: Logger;
  /** HTTP client instance */
  httpInstance: HttpInstance;
}

/**
 * Token response from API
 */
interface TokenResponse {
  tenant_access_token: string;
  expire: number;
}

/**
 * Manages authentication tokens for FeiShu API
 *
 * Handles token fetching, caching, and renewal
 */
export class TokenManager {
  private appId: string;
  private appSecret: string;
  private cache: Cache;
  private domain: string;
  private logger: Logger;
  private httpInstance: HttpInstance;

  /**
   * Create a new token manager
   *
   * @param params - Configuration parameters
   */
  constructor(params: TokenManagerParams) {
    const { appId, appSecret, cache, domain, logger, httpInstance } = params;
    this.appId = appId;
    this.appSecret = appSecret;
    this.cache = cache;
    this.domain = domain;
    this.logger = logger;
    this.httpInstance = httpInstance;
    this.logger.debug('token manager is ready');
  }

  /**
   * Fetch tenant access token from FeiShu API
   *
   * @returns Token response with access token and expiration time
   */
  private async fetchTenantAccessToken(): Promise<TokenResponse> {
    try {
      const response = await this.httpInstance.post(
        `${this.domain}/open-apis/auth/v3/tenant_access_token/internal`,
        {
          app_id: this.appId,
          app_secret: this.appSecret,
        },
      );
      return response;
    } catch (error) {
      this.logger.error(error);
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
    const expirationTime = new Date().getTime() + expire * 1000 - 3 * 60 * 1000;
    await this.cache.set(CTenantAccessToken, token, expirationTime, {
      namespace: this.appId,
    });
  }

  /**
   * Get tenant access token with caching
   *
   * Retrieves token from cache or fetches a new one if necessary
   *
   * @returns Access token
   */
  async getCustomTenantAccessToken(): Promise<string> {
    const cachedTenantAccessToken = await this.cache.get(CTenantAccessToken, {
      namespace: this.appId,
    });

    if (cachedTenantAccessToken) {
      this.logger.debug('using cached tenant access token');
      return cachedTenantAccessToken;
    }

    this.logger.debug('requesting new tenant access token');
    const { tenant_access_token, expire } = await this.fetchTenantAccessToken();
    await this.cacheTenantAccessToken(tenant_access_token, expire);

    return tenant_access_token;
  }

  /**
   * Get tenant access token
   *
   * Main token retrieval method that applications should use
   *
   * @param params - Optional parameters for token retrieval
   * @returns Access token
   */
  async getTenantAccessToken(params?: {
    [CTenantKey]?: string;
  }): Promise<string> {
    this.logger.debug('get tenant access token', params);
    return await this.getCustomTenantAccessToken();
  }
}

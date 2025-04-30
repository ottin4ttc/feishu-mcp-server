import { jest } from '@jest/globals';

const mockPost = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    data: {
      user_access_token: 'test_user_access_token',
      refresh_token: 'test_refresh_token',
      expire: 7200,
      token_type: 'Bearer',
    },
  });
});

const mockHttpInstance = {
  post: mockPost,
};

const mockCache = {
  get: jest.fn(),
  set: jest.fn().mockResolvedValue(undefined),
};

const mockLogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('axios', () => ({
  create: jest.fn().mockReturnValue(mockHttpInstance),
}));

import { TokenManager } from '../src/client/token-manager.js';

describe('TokenManager - User Access Token', () => {
  let tokenManager;

  beforeEach(() => {
    jest.clearAllMocks();
    tokenManager = new TokenManager({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
      cache: mockCache,
      logger: mockLogger,
      httpInstance: mockHttpInstance,
      authorizationCode: 'test-auth-code',
    });
  });

  describe('getUserAccessToken', () => {
    it('should return cached token if available', async () => {
      mockCache.get.mockResolvedValueOnce('cached_user_token');

      const token = await tokenManager.getUserAccessToken();

      expect(token).toBe('cached_user_token');
      expect(mockCache.get).toHaveBeenCalledWith('user-access-token', {
        namespace: 'test-app-id',
      });
      expect(mockPost).not.toHaveBeenCalled();
    });

    it('should fetch new token if cache misses', async () => {
      mockCache.get.mockResolvedValueOnce(null);

      const token = await tokenManager.getUserAccessToken();

      expect(token).toBe('test_user_access_token');
      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/authen/v1/access_token',
        {
          grant_type: 'authorization_code',
          code: 'test-auth-code',
          app_id: 'test-app-id',
          app_secret: 'test-app-secret',
        },
      );
      expect(mockCache.set).toHaveBeenCalledWith(
        'user-access-token',
        'test_user_access_token',
        expect.any(Number),
        { namespace: 'test-app-id' },
      );
    });

    it('should use provided code instead of stored code if given', async () => {
      mockCache.get.mockResolvedValueOnce(null);

      const token = await tokenManager.getUserAccessToken('new-auth-code');

      expect(token).toBe('test_user_access_token');
      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/authen/v1/access_token',
        {
          grant_type: 'authorization_code',
          code: 'new-auth-code',
          app_id: 'test-app-id',
          app_secret: 'test-app-secret',
        },
      );
    });

    it('should throw error if no authorization code is available', async () => {
      mockCache.get.mockResolvedValueOnce(null);

      const noCodeTokenManager = new TokenManager({
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
        cache: mockCache,
        logger: mockLogger,
        httpInstance: mockHttpInstance,
      });

      await expect(noCodeTokenManager.getUserAccessToken()).rejects.toThrow(
        'Authorization code is required to get user access token',
      );
    });

    it('should include redirect URI in request if provided', async () => {
      mockCache.get.mockResolvedValueOnce(null);

      const tokenManagerWithRedirect = new TokenManager({
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
        cache: mockCache,
        logger: mockLogger,
        httpInstance: mockHttpInstance,
        authorizationCode: 'test-auth-code',
        redirectUri: 'https://example.com/callback',
      });

      await tokenManagerWithRedirect.getUserAccessToken();

      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/authen/v1/access_token',
        {
          grant_type: 'authorization_code',
          code: 'test-auth-code',
          app_id: 'test-app-id',
          app_secret: 'test-app-secret',
          redirect_uri: 'https://example.com/callback',
        },
      );
    });
  });
});

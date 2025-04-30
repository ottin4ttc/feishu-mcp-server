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

describe('TokenManager - OAuth Flow', () => {
  let tokenManager;

  beforeEach(() => {
    jest.clearAllMocks();
    tokenManager = new TokenManager({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
      cache: mockCache,
      logger: mockLogger,
      httpInstance: mockHttpInstance,
    });
  });

  describe('generateAuthorizationUrl', () => {
    it('should generate a valid authorization URL with required parameters', () => {
      const redirectUri = 'https://example.com/callback';
      const url = tokenManager.generateAuthorizationUrl(redirectUri);

      expect(url).toContain('https://open.feishu.cn/open-apis/authen/v1/index');
      expect(url).toContain('app_id=test-app-id');
      expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
    });

    it('should include optional parameters when provided', () => {
      const redirectUri = 'https://example.com/callback';
      const scope = 'contact:contact.base:readonly task:task:read';
      const state = 'random_state_123';

      const url = tokenManager.generateAuthorizationUrl(
        redirectUri,
        scope,
        state,
      );

      expect(url).toContain(`scope=${encodeURIComponent(scope)}`);
      expect(url).toContain(`state=${state}`);
    });

    it('should use the redirect URI from constructor if not provided', () => {
      const redirectUri = 'https://example.com/callback';

      const tokenManagerWithRedirect = new TokenManager({
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
        cache: mockCache,
        logger: mockLogger,
        httpInstance: mockHttpInstance,
        redirectUri,
      });

      const url = tokenManagerWithRedirect.generateAuthorizationUrl();

      expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
    });

    it('should throw an error if no redirect URI is available', () => {
      expect(() => tokenManager.generateAuthorizationUrl()).toThrow(
        'Redirect URI is required',
      );
    });
  });

  describe('getUserAccessToken with OAuth flow', () => {
    it('should throw an error with authorization URL when no code is available', async () => {
      mockCache.get.mockResolvedValueOnce(null);

      const redirectUri = 'https://example.com/callback';

      await expect(
        tokenManager.getUserAccessToken(null, redirectUri),
      ).rejects.toThrow(
        /Authorization code is required.*Please redirect the user/,
      );
    });

    it('should use the provided authorization code to get a token', async () => {
      mockCache.get.mockResolvedValueOnce(null);

      const code = 'new_auth_code';
      await tokenManager.getUserAccessToken(code);

      expect(mockPost).toHaveBeenCalledWith(
        '/open-apis/authen/v1/access_token',
        {
          grant_type: 'authorization_code',
          code,
          app_id: 'test-app-id',
          app_secret: 'test-app-secret',
        },
      );
    });
  });

  describe('setAuthorizationCode', () => {
    it('should update the authorization code', () => {
      const code = 'new_auth_code';
      tokenManager.setAuthorizationCode(code);

      mockCache.get.mockResolvedValueOnce(null);

      return tokenManager.getUserAccessToken().then(() => {
        expect(mockPost).toHaveBeenCalledWith(
          '/open-apis/authen/v1/access_token',
          {
            grant_type: 'authorization_code',
            code,
            app_id: 'test-app-id',
            app_secret: 'test-app-secret',
          },
        );
      });
    });

    it('should throw an error if code is empty', () => {
      expect(() => tokenManager.setAuthorizationCode('')).toThrow(
        'Authorization code cannot be empty',
      );
    });
  });

  describe('setRedirectUri', () => {
    it('should update the redirect URI', () => {
      const uri = 'https://example.com/new-callback';
      tokenManager.setRedirectUri(uri);

      const url = tokenManager.generateAuthorizationUrl();

      expect(url).toContain(`redirect_uri=${encodeURIComponent(uri)}`);
    });

    it('should throw an error if URI is empty', () => {
      expect(() => tokenManager.setRedirectUri('')).toThrow(
        'Redirect URI cannot be empty',
      );
    });
  });
});

import { jest } from '@jest/globals';

const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          user_id: 'user123',
          open_id: 'ou_123',
          name: '张三',
          en_name: 'Zhang San',
          email: 'zhangsan@example.com',
          avatar: {
            avatar_url: 'https://example.com/avatar.jpg',
          },
          department_ids: ['dep_123'],
          status: {
            is_activated: true,
            is_deactivated: false,
          },
        },
      ],
      page_token: 'next_page_token',
      has_more: false,
    },
  });
});

jest.mock('../src/client/api-client.js', () => ({
  ApiClient: jest.fn().mockImplementation(() => ({
    get: mockGet,
  })),
}));

import { UserClient } from '../src/client/users/user-client.js';

describe('UserClient - Search Users', () => {
  let userClient;

  beforeEach(() => {
    jest.clearAllMocks();
    userClient = new UserClient({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
    });
  });

  describe('searchUsers', () => {
    it('should search users with the correct parameters', async () => {
      const query = '张三';
      const options = {
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await userClient.searchUsers(query, options);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/search/v1/user', {
        query,
        ...options,
      });
    });

    it('should work with only query parameter', async () => {
      const query = '张三';

      await userClient.searchUsers(query);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/search/v1/user', {
        query,
      });
    });

    it('should return the response from the API', async () => {
      const query = '张三';
      const response = await userClient.searchUsers(query);

      expect(response).toEqual({
        code: 0,
        data: {
          items: [
            {
              user_id: 'user123',
              open_id: 'ou_123',
              name: '张三',
              en_name: 'Zhang San',
              email: 'zhangsan@example.com',
              avatar: {
                avatar_url: 'https://example.com/avatar.jpg',
              },
              department_ids: ['dep_123'],
              status: {
                is_activated: true,
                is_deactivated: false,
              },
            },
          ],
          page_token: 'next_page_token',
          has_more: false,
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const query = '张三';

      await expect(userClient.searchUsers(query)).rejects.toThrow('API Error');

      expect(mockGet).toHaveBeenCalledWith('/open-apis/search/v1/user', {
        query,
      });
    });
  });
});

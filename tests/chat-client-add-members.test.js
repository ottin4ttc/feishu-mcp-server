const { ChatClient } = require('../dist/client/chats/chat-client.js');
const { ApiClient } = require('../dist/client/api-client.js');

jest.mock('../dist/client/api-client.js', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        request: jest
          .fn()
          .mockImplementation((method, path, params, options) => {
            if (
              method === 'POST' &&
              path.includes('/open-apis/im/v1/chats/') &&
              path.includes('/members')
            ) {
              const chatId = path.split('/').slice(-2)[0];
              return Promise.resolve({
                code: 0,
                data: {
                  invalid_id_list: params.id_list.filter((id) =>
                    id.includes('invalid'),
                  ),
                },
                msg: 'success',
              });
            }
            return Promise.reject(new Error('Unexpected request'));
          }),
      };
    }),
  };
});

describe('ChatClient', () => {
  let chatClient;

  beforeEach(() => {
    jest.clearAllMocks();

    chatClient = new ChatClient({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
    });
  });

  describe('addChatMembers', () => {
    it('should add members to a chat with minimal parameters', async () => {
      const chatId = 'test-chat-id';
      const params = {
        id_list: ['user1', 'user2', 'user3'],
      };

      const result = await chatClient.addChatMembers(chatId, params);

      expect(result).toEqual({
        code: 0,
        data: {
          invalid_id_list: [],
        },
        msg: 'success',
      });

      const apiClient = ApiClient.mock.instances[0];
      const requestMock = apiClient.request;

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith(
        'POST',
        `/open-apis/im/v1/chats/${chatId}/members`,
        params,
        undefined,
      );
    });

    it('should add members to a chat with all parameters', async () => {
      const chatId = 'test-chat-id';
      const params = {
        id_list: ['user1', 'user2', 'user3'],
        member_type: 'user',
        user_id_type: 'open_id',
      };

      const result = await chatClient.addChatMembers(chatId, params);

      expect(result).toEqual({
        code: 0,
        data: {
          invalid_id_list: [],
        },
        msg: 'success',
      });

      const apiClient = ApiClient.mock.instances[0];
      const requestMock = apiClient.request;

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith(
        'POST',
        `/open-apis/im/v1/chats/${chatId}/members`,
        params,
        undefined,
      );
    });

    it('should handle invalid member IDs', async () => {
      const chatId = 'test-chat-id';
      const params = {
        id_list: ['user1', 'invalid-user2', 'user3'],
      };

      const result = await chatClient.addChatMembers(chatId, params);

      expect(result).toEqual({
        code: 0,
        data: {
          invalid_id_list: ['invalid-user2'],
        },
        msg: 'success',
      });

      const apiClient = ApiClient.mock.instances[0];
      const requestMock = apiClient.request;

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith(
        'POST',
        `/open-apis/im/v1/chats/${chatId}/members`,
        params,
        undefined,
      );
    });

    it('should handle API errors', async () => {
      const apiClient = ApiClient.mock.instances[0];
      apiClient.request.mockRejectedValueOnce(new Error('API Error'));

      const chatId = 'test-chat-id';
      const params = {
        id_list: ['user1', 'user2', 'user3'],
      };

      await expect(chatClient.addChatMembers(chatId, params)).rejects.toThrow(
        'API Error',
      );

      expect(apiClient.request).toHaveBeenCalledTimes(1);
      expect(apiClient.request).toHaveBeenCalledWith(
        'POST',
        `/open-apis/im/v1/chats/${chatId}/members`,
        params,
        undefined,
      );
    });
  });
});

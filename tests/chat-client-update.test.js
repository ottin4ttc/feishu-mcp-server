const { ChatClient } = require('../dist/client/chats/chat-client.js');
const { ApiClient } = require('../dist/client/api-client.js');

jest.mock('../dist/client/api-client.js', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        request: jest
          .fn()
          .mockImplementation((method, path, params, options) => {
            if (method === 'PUT' && path.includes('/open-apis/im/v1/chats/')) {
              const chatId = path.split('/').pop();
              return Promise.resolve({
                code: 0,
                data: {
                  chat_id: chatId,
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

  describe('updateChat', () => {
    it('should update a chat with minimal parameters', async () => {
      const chatId = 'test-chat-id';
      const params = {
        name: 'Updated Chat Name',
      };

      const result = await chatClient.updateChat(chatId, params);

      expect(result).toEqual({
        code: 0,
        data: {
          chat_id: chatId,
        },
        msg: 'success',
      });

      const apiClient = ApiClient.mock.instances[0];
      const requestMock = apiClient.request;

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith(
        'PUT',
        `/open-apis/im/v1/chats/${chatId}`,
        { name: 'Updated Chat Name' },
        undefined,
      );
    });

    it('should update a chat with all parameters', async () => {
      const chatId = 'test-chat-id';
      const params = {
        name: 'Updated Chat Name',
        description: 'Updated description',
        i18n_names: { en_us: 'English Name', zh_cn: '中文名称' },
        only_owner_add: true,
        share_allowed: false,
        only_owner_at_all: true,
        only_owner_edit: true,
        join_message_visibility: 'all_members',
        leave_message_visibility: 'all_members',
        membership_approval: 'no_approval',
        user_id_type: 'open_id',
      };

      const result = await chatClient.updateChat(chatId, params);

      expect(result).toEqual({
        code: 0,
        data: {
          chat_id: chatId,
        },
        msg: 'success',
      });

      const apiClient = ApiClient.mock.instances[0];
      const requestMock = apiClient.request;

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith(
        'PUT',
        `/open-apis/im/v1/chats/${chatId}`,
        params,
        undefined,
      );
    });

    it('should handle API errors', async () => {
      const apiClient = ApiClient.mock.instances[0];
      apiClient.request.mockRejectedValueOnce(new Error('API Error'));

      const chatId = 'test-chat-id';
      const params = {
        name: 'Updated Chat Name',
      };

      await expect(chatClient.updateChat(chatId, params)).rejects.toThrow(
        'API Error',
      );

      expect(apiClient.request).toHaveBeenCalledTimes(1);
      expect(apiClient.request).toHaveBeenCalledWith(
        'PUT',
        `/open-apis/im/v1/chats/${chatId}`,
        params,
        undefined,
      );
    });
  });
});

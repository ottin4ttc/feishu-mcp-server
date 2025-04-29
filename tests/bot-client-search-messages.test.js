import { jest } from '@jest/globals';

const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          message_id: 'msg_123',
          content: '{"text":"Hello World"}',
          sender_id: {
            user_id: 'user_123',
            open_id: 'ou_123',
          },
          chat_id: 'chat_123',
          create_time: 1609459200,
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

import { BotClient } from '../src/client/bots/bot-client.js';

describe('BotClient - Search Messages', () => {
  let botClient;

  beforeEach(() => {
    jest.clearAllMocks();
    botClient = new BotClient({
      appId: 'test-app-id',
      appSecret: 'test-app-secret',
    });
  });

  describe('searchMessages', () => {
    it('should search messages with the correct parameters', async () => {
      const query = '预算';
      const options = {
        messageType: 'text',
        pageSize: 20,
        pageToken: 'some_page_token',
      };

      await botClient.searchMessages(query, options);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/im/v1/messages/search', {
        query,
        message_type: options.messageType,
        page_size: options.pageSize,
        page_token: options.pageToken,
      });
    });

    it('should work with only query parameter', async () => {
      const query = '预算';

      await botClient.searchMessages(query);

      expect(mockGet).toHaveBeenCalledWith('/open-apis/im/v1/messages/search', {
        query,
      });
    });

    it('should return the response from the API', async () => {
      const query = '预算';
      const response = await botClient.searchMessages(query);

      expect(response).toEqual({
        code: 0,
        data: {
          items: [
            {
              message_id: 'msg_123',
              content: '{"text":"Hello World"}',
              sender_id: {
                user_id: 'user_123',
                open_id: 'ou_123',
              },
              chat_id: 'chat_123',
              create_time: 1609459200,
            },
          ],
          page_token: 'next_page_token',
          has_more: false,
        },
      });
    });

    it('should handle API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const query = '预算';

      await expect(botClient.searchMessages(query)).rejects.toThrow(
        'API Error',
      );

      expect(mockGet).toHaveBeenCalledWith('/open-apis/im/v1/messages/search', {
        query,
      });
    });
  });
});

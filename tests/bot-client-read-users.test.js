const mockGetList = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          user_id: 'user1',
          user_id_type: 'open_id',
          read_time: '2023-01-01T12:00:00Z',
        },
        {
          user_id: 'user2',
          user_id_type: 'open_id',
          read_time: '2023-01-01T12:05:00Z',
        },
      ],
      page_token: 'next_page_token',
      has_more: true,
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    getList: mockGetList,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { BotClient } from '../src/client/bots/bot-client.js';

describe('BotClient - Get Message Read Users', () => {
  let botClient;

  beforeEach(() => {
    jest.clearAllMocks();
    botClient = new BotClient();
  });

  describe('getMessageReadUsers', () => {
    it('should get message read users with correct parameters', async () => {
      const messageId = 'test_message_id';
      const params = {
        page_size: 20,
        page_token: 'test_page_token',
      };

      await botClient.getMessageReadUsers(messageId, params);

      expect(mockGetList).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/read_users`,
        {
          pageSize: 20,
          pageToken: 'test_page_token',
        },
      );
    });

    it('should handle pagination parameters correctly', async () => {
      const messageId = 'test_message_id';

      await botClient.getMessageReadUsers(messageId);
      expect(mockGetList).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/read_users`,
        {},
      );

      await botClient.getMessageReadUsers(messageId, { page_size: 10 });
      expect(mockGetList).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/read_users`,
        { pageSize: 10 },
      );

      await botClient.getMessageReadUsers(messageId, { page_token: 'token' });
      expect(mockGetList).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/read_users`,
        { pageToken: 'token' },
      );
    });

    it('should return the response from the API', async () => {
      const messageId = 'test_message_id';
      const response = await botClient.getMessageReadUsers(messageId);

      expect(response).toEqual({
        code: 0,
        data: {
          items: [
            {
              user_id: 'user1',
              user_id_type: 'open_id',
              read_time: '2023-01-01T12:00:00Z',
            },
            {
              user_id: 'user2',
              user_id_type: 'open_id',
              read_time: '2023-01-01T12:05:00Z',
            },
          ],
          page_token: 'next_page_token',
          has_more: true,
        },
      });
    });
  });
});

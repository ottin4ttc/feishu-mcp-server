const mockPost = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      message_id: 'test_forward_message_id',
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    post: mockPost,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { BotClient } from '../src/client/bots/bot-client.js';

const MessageType = {
  TEXT: 'text',
  INTERACTIVE: 'interactive',
};

describe('BotClient - Forward Message', () => {
  let botClient;
  let mockApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    botClient = new BotClient();
    mockApiClient = MockApiClient;
  });

  describe('forwardMessage', () => {
    it('should forward a message with correct parameters', async () => {
      const messageId = 'test_message_id';
      const receiveId = 'test_chat_id';
      const receiveIdType = 'chat_id';

      await botClient.forwardMessage(messageId, receiveId, receiveIdType);

      expect(mockPost).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/forward`,
        {
          receive_id: receiveId,
        },
        { receive_id_type: receiveIdType },
      );
    });

    it('should use default receive_id_type if not provided', async () => {
      const messageId = 'test_message_id';
      const receiveId = 'test_chat_id';

      await botClient.forwardMessage(messageId, receiveId);

      expect(mockPost).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/forward`,
        {
          receive_id: receiveId,
        },
        { receive_id_type: 'chat_id' },
      );
    });

    it('should return the response from the API', async () => {
      const messageId = 'test_message_id';
      const receiveId = 'test_chat_id';

      const response = await botClient.forwardMessage(messageId, receiveId);

      expect(response).toEqual({
        code: 0,
        data: {
          message_id: 'test_forward_message_id',
        },
      });
    });
  });
});

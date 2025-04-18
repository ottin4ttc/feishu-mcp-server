import { ApiClient } from '../src/client/api-client.js';
import { BotClient } from '../src/client/bots/bot-client.js';
import { MessageType } from '../src/client/bots/types/index.js';

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        post: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            code: 0,
            data: {
              message_id: 'test_reply_message_id',
            },
          });
        }),
      };
    }),
  };
});

describe('BotClient - Reply Message', () => {
  let botClient;
  let mockApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const MockApiClient = ApiClient;
    botClient = new BotClient();
    mockApiClient = MockApiClient.mock.results[0].value;
  });

  describe('replyMessage', () => {
    it('should reply to a message with text content', async () => {
      const messageId = 'test_message_id';
      const text = 'This is a reply';
      const msgType = MessageType.TEXT;

      await botClient.replyMessage(messageId, text, msgType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/reply`,
        {
          content: JSON.stringify({ text }),
          msg_type: msgType,
        },
      );
    });

    it('should reply to a message with interactive card content', async () => {
      const messageId = 'test_message_id';
      const cardContent = {
        elements: [
          {
            tag: 'div',
            text: {
              content: 'Reply card content',
              tag: 'plain_text',
            },
          },
        ],
      };
      const msgType = MessageType.INTERACTIVE;

      await botClient.replyMessage(messageId, cardContent, msgType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/reply`,
        {
          content: JSON.stringify({ card: cardContent }),
          msg_type: msgType,
        },
      );
    });

    it('should handle string card content correctly when replying', async () => {
      const messageId = 'test_message_id';
      const cardContent = JSON.stringify({
        elements: [
          {
            tag: 'div',
            text: {
              content: 'Reply card content',
              tag: 'plain_text',
            },
          },
        ],
      });
      const msgType = MessageType.INTERACTIVE;

      await botClient.replyMessage(messageId, cardContent, msgType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}/reply`,
        {
          content: JSON.stringify({ card: JSON.parse(cardContent) }),
          msg_type: msgType,
        },
      );
    });

    it('should return the response from the API', async () => {
      const messageId = 'test_message_id';
      const text = 'This is a reply';
      const msgType = MessageType.TEXT;

      const response = await botClient.replyMessage(messageId, text, msgType);

      expect(response).toEqual({
        code: 0,
        data: {
          message_id: 'test_reply_message_id',
        },
      });
    });
  });
});

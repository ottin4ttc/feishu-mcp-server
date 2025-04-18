import { ApiClient } from '../src/client/api-client.js';
import { BotClient } from '../src/client/bots/bot-client.js';
import { MessageType } from '../src/client/bots/types/index.js';

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: jest.fn().mockImplementation(() => {
      return {
        put: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            code: 0,
            data: {
              message_id: 'test_edit_message_id',
            },
          });
        }),
      };
    }),
  };
});

describe('BotClient - Edit Message', () => {
  let botClient;
  let mockApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const MockApiClient = ApiClient;
    botClient = new BotClient();
    mockApiClient = MockApiClient.mock.results[0].value;
  });

  describe('editMessage', () => {
    it('should edit a message with text content', async () => {
      const messageId = 'test_message_id';
      const text = 'This is an edited message';
      const msgType = MessageType.TEXT;

      await botClient.editMessage(messageId, text, msgType);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}`,
        {
          content: JSON.stringify({ text }),
          msg_type: msgType,
        },
      );
    });

    it('should edit a message with interactive card content', async () => {
      const messageId = 'test_message_id';
      const cardContent = {
        elements: [
          {
            tag: 'div',
            text: {
              content: 'Edited card content',
              tag: 'plain_text',
            },
          },
        ],
      };
      const msgType = MessageType.INTERACTIVE;

      await botClient.editMessage(messageId, cardContent, msgType);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}`,
        {
          content: JSON.stringify({ card: cardContent }),
          msg_type: msgType,
        },
      );
    });

    it('should handle string card content correctly when editing', async () => {
      const messageId = 'test_message_id';
      const cardContent = JSON.stringify({
        elements: [
          {
            tag: 'div',
            text: {
              content: 'Edited card content',
              tag: 'plain_text',
            },
          },
        ],
      });
      const msgType = MessageType.INTERACTIVE;

      await botClient.editMessage(messageId, cardContent, msgType);

      expect(mockApiClient.put).toHaveBeenCalledWith(
        `/open-apis/im/v1/messages/${messageId}`,
        {
          content: JSON.stringify({ card: JSON.parse(cardContent) }),
          msg_type: msgType,
        },
      );
    });

    it('should return the response from the API', async () => {
      const messageId = 'test_message_id';
      const text = 'This is an edited message';
      const msgType = MessageType.TEXT;

      const response = await botClient.editMessage(messageId, text, msgType);

      expect(response).toEqual({
        code: 0,
        data: {
          message_id: 'test_edit_message_id',
        },
      });
    });
  });
});

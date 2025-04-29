const mockPost = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      message_id: 'test_message_id',
    },
  });
});

const mockGetList = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          message_id: 'test_message_id',
          content: '{"text":"test message"}',
          create_time: '1617123456789',
        },
      ],
      page_token: 'next_page_token',
      has_more: false,
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    post: mockPost,
    getList: mockGetList,
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

describe('BotClient', () => {
  let botClient;
  let mockApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    const MockApiClient = ApiClient;
    botClient = new BotClient();
    mockApiClient = MockApiClient.mock.results[0].value;
  });

  describe('sendMessage', () => {
    it('should send a text message with correct parameters including receive_id_type', async () => {
      const chatId = 'test_chat_id';
      const text = 'Hello, world!';
      const msgType = MessageType.TEXT;

      await botClient.sendMessage(chatId, text, msgType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        {
          receive_id: chatId,
          content: JSON.stringify({ text }),
          msg_type: msgType,
        },
        { receive_id_type: 'chat_id' },
      );
    });

    it('should send an interactive card message with correct parameters including receive_id_type', async () => {
      const chatId = 'test_chat_id';
      const cardContent = {
        elements: [
          {
            tag: 'div',
            text: {
              content: 'Card content',
              tag: 'plain_text',
            },
          },
        ],
      };
      const msgType = MessageType.INTERACTIVE;

      await botClient.sendMessage(chatId, cardContent, msgType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        {
          receive_id: chatId,
          content: JSON.stringify({ card: cardContent }),
          msg_type: msgType,
        },
        { receive_id_type: 'chat_id' },
      );
    });

    it('should handle string card content correctly with receive_id_type parameter', async () => {
      const chatId = 'test_chat_id';
      const cardContent = JSON.stringify({
        elements: [
          {
            tag: 'div',
            text: {
              content: 'Card content',
              tag: 'plain_text',
            },
          },
        ],
      });
      const msgType = MessageType.INTERACTIVE;

      await botClient.sendMessage(chatId, cardContent, msgType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        {
          receive_id: chatId,
          content: JSON.stringify({ card: JSON.parse(cardContent) }),
          msg_type: msgType,
        },
        { receive_id_type: 'chat_id' },
      );
    });
  });

  describe('getMessages', () => {
    it('should get messages with correct parameters', async () => {
      const params = {
        chat_id: 'test_chat_id',
        page_size: 20,
        page_token: 'test_page_token',
      };

      await botClient.getMessages(params);

      expect(mockApiClient.getList).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        { pageSize: 20, pageToken: 'test_page_token' },
        { chat_id: 'test_chat_id' },
      );
    });
  });

  describe('sendMessage with custom receive_id_type', () => {
    it('should send a message with custom receive_id_type', async () => {
      const userId = 'test_user_id';
      const text = 'Hello, user!';
      const msgType = MessageType.TEXT;
      const receiveIdType = 'open_id';

      await botClient.sendMessage(userId, text, msgType, receiveIdType);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/open-apis/im/v1/messages',
        {
          receive_id: userId,
          content: JSON.stringify({ text }),
          msg_type: msgType,
        },
        { receive_id_type: receiveIdType },
      );
    });
  });
});

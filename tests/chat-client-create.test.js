const mockPost = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      chat_id: 'test_chat_id',
      invalid_user_ids: ['invalid_user1'],
      invalid_bot_ids: ['invalid_bot1'],
      invalid_open_ids: ['invalid_open1'],
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

import { ChatClient } from '../src/client/chats/chat-client.js';

describe('ChatClient - Create Chat', () => {
  let chatClient;

  beforeEach(() => {
    jest.clearAllMocks();
    chatClient = new ChatClient();
  });

  describe('createChat', () => {
    it('should create a chat with required parameters', async () => {
      const params = {
        name: 'Test Chat',
      };

      await chatClient.createChat(params);

      expect(mockPost).toHaveBeenCalledWith('/open-apis/im/v1/chats', params);
    });

    it('should create a chat with all parameters', async () => {
      const params = {
        name: 'Test Chat',
        description: 'Test Description',
        user_ids: ['user1', 'user2'],
        bot_ids: ['bot1', 'bot2'],
        open_ids: ['open1', 'open2'],
        only_owner_add: true,
        share_allowed: true,
        only_owner_at_all: true,
        only_owner_edit: true,
        join_message_visibility: 'all_members',
        leave_message_visibility: 'all_members',
        membership_approval: 'no_approval_required',
        external_ids: ['ext1', 'ext2'],
        user_id_type: 'open_id',
      };

      await chatClient.createChat(params);

      expect(mockPost).toHaveBeenCalledWith('/open-apis/im/v1/chats', params);
    });

    it('should return the response from the API', async () => {
      const params = {
        name: 'Test Chat',
      };

      const response = await chatClient.createChat(params);

      expect(response).toEqual({
        code: 0,
        data: {
          chat_id: 'test_chat_id',
          invalid_user_ids: ['invalid_user1'],
          invalid_bot_ids: ['invalid_bot1'],
          invalid_open_ids: ['invalid_open1'],
        },
      });
    });
  });
});

const mockGet = jest.fn().mockImplementation(() => {
  return Promise.resolve({
    code: 0,
    data: {
      chat_id: 'test_chat_id',
      avatar: 'https://example.com/avatar.png',
      name: 'Test Chat',
      description: 'Test Description',
      owner_id: 'test_owner_id',
      owner_id_type: 'open_id',
      external: false,
      tenant_key: 'test_tenant_key',
      add_member_permission: 'all_members',
      share_card_permission: 'all_members',
      at_all_permission: 'all_members',
      edit_permission: 'all_members',
      membership_approval: 'no_approval_required',
      join_message_visibility: 'all_members',
      leave_message_visibility: 'all_members',
      type: 'group',
      mode_type: 'chat',
      chat_tag: 'test_tag',
      bot_manager_ids: ['bot1', 'bot2'],
      i18n_names: { zh_cn: '测试群聊' },
    },
  });
});

const MockApiClient = jest.fn().mockImplementation(() => {
  return {
    get: mockGet,
  };
});

jest.mock('../src/client/api-client.js', () => {
  return {
    ApiClient: MockApiClient,
  };
});

import { ChatClient } from '../src/client/chats/chat-client.js';

describe('ChatClient - Get Chat Info', () => {
  let chatClient;

  beforeEach(() => {
    jest.clearAllMocks();
    chatClient = new ChatClient();
  });

  describe('getChatInfo', () => {
    it('should get chat info with required parameters', async () => {
      const chatId = 'test_chat_id';

      await chatClient.getChatInfo(chatId);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/im/v1/chats/${chatId}`,
        undefined,
      );
    });

    it('should get chat info with optional parameters', async () => {
      const chatId = 'test_chat_id';
      const params = {
        user_id_type: 'open_id',
      };

      await chatClient.getChatInfo(chatId, params);

      expect(mockGet).toHaveBeenCalledWith(
        `/open-apis/im/v1/chats/${chatId}`,
        params,
      );
    });

    it('should return the response from the API', async () => {
      const chatId = 'test_chat_id';

      const response = await chatClient.getChatInfo(chatId);

      expect(response).toEqual({
        code: 0,
        data: {
          chat_id: 'test_chat_id',
          avatar: 'https://example.com/avatar.png',
          name: 'Test Chat',
          description: 'Test Description',
          owner_id: 'test_owner_id',
          owner_id_type: 'open_id',
          external: false,
          tenant_key: 'test_tenant_key',
          add_member_permission: 'all_members',
          share_card_permission: 'all_members',
          at_all_permission: 'all_members',
          edit_permission: 'all_members',
          membership_approval: 'no_approval_required',
          join_message_visibility: 'all_members',
          leave_message_visibility: 'all_members',
          type: 'group',
          mode_type: 'chat',
          chat_tag: 'test_tag',
          bot_manager_ids: ['bot1', 'bot2'],
          i18n_names: { zh_cn: '测试群聊' },
        },
      });
    });
  });
});

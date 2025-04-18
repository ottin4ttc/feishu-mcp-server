/**
 * Chat Service
 *
 * Business logic for FeiShu chat operations.
 */
import { ChatClient } from '@/client/chats/chat-client.js';
import type {
  AddChatMembersParams,
  AddChatMembersResponse,
  ChatData,
  ChatInfoResponse,
  ChatListParams,
  ChatSearchParams,
  CreateChatParams,
  CreateChatResponse,
  GetChatInfoParams,
  UpdateChatParams,
  UpdateChatResponse,
} from '@/client/chats/types/index.js';
import type { ApiClientConfig } from '@/client/types.js';
import { FeiShuApiError } from '../error.js';
import type {
  ChatListOptionsBO,
  ChatResultBO,
  ChatSearchOptionsBO,
} from './types/index.js';

/**
 * Chat search options
 */
export interface ChatSearchOptions {
  query?: string;
  pageToken?: string;
  pageSize?: number;
  userIdType?: 'open_id' | 'union_id' | 'user_id';
}

/**
 * Chat list options
 */
export interface ChatListOptions {
  pageToken?: string;
  pageSize?: number;
  userIdType?: 'open_id' | 'union_id' | 'user_id';
}

/**
 * Chat result interface
 */
export interface ChatResult {
  chats: ChatData[];
  pageToken?: string;
  hasMore: boolean;
}

/**
 * Chat service for FeiShu
 */
export class ChatService {
  private client: ChatClient;

  /**
   * Create chat service
   *
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig) {
    this.client = new ChatClient(config);
  }

  /**
   * Search for chats visible to the user or bot
   *
   * @param options - Search options
   * @returns List of chats matching the search criteria
   * @throws FeiShuApiError if API request fails
   */
  async searchChats(options: ChatSearchOptionsBO = {}): Promise<ChatResultBO> {
    try {
      const { query, pageToken, pageSize, userIdType } = options;

      const params: ChatSearchParams = {
        query,
        pageToken,
        pageSize,
        userIdType,
      };

      const response = await this.client.searchChats(params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to search chats: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data) {
        throw new FeiShuApiError('Empty response when searching chats');
      }

      const chatInfos = response.data.items.map((chat) => ({
        id: chat.chat_id,
        avatar: chat.avatar,
        name: chat.name,
        description: chat.description,
        ownerId: chat.owner_id,
        ownerIdType: chat.owner_id_type,
        isExternal: chat.external,
        tenantKey: chat.tenant_key,
        status: chat.chat_status,
      }));

      return {
        chats: chatInfos,
        pageToken: response.data.has_more
          ? response.data.page_token
          : undefined,
        hasMore: response.data.has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error searching chats: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get list of chats (groups) that the user or bot belongs to
   *
   * @param options - Chat list options
   * @returns List of chats the user or bot belongs to
   * @throws FeiShuApiError if API request fails
   */
  async getChats(options: ChatListOptionsBO = {}): Promise<ChatResultBO> {
    try {
      const { pageToken, pageSize, userIdType } = options;

      const params: ChatListParams = {
        pageToken,
        pageSize,
        userIdType,
      };

      const response = await this.client.getChats(params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get chats: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data) {
        throw new FeiShuApiError('Empty response when getting chats');
      }

      const chatInfos = response.data.items.map((chat) => ({
        id: chat.chat_id,
        avatar: chat.avatar,
        name: chat.name,
        description: chat.description,
        ownerId: chat.owner_id,
        ownerIdType: chat.owner_id_type,
        isExternal: chat.external,
        tenantKey: chat.tenant_key,
        status: chat.chat_status,
      }));

      return {
        chats: chatInfos,
        pageToken: response.data.has_more
          ? response.data.page_token
          : undefined,
        hasMore: response.data.has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error getting chats: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Create a new chat
   *
   * @param name - Chat name
   * @param options - Additional chat creation options
   * @returns Created chat information
   * @throws FeiShuApiError if API request fails
   */
  async createChat(
    name: string,
    options: Omit<CreateChatParams, 'name'> = {},
  ): Promise<{
    chatId: string;
    invalidUserIds?: string[];
    invalidBotIds?: string[];
    invalidOpenIds?: string[];
  }> {
    try {
      const params: CreateChatParams = {
        name,
        ...options,
      };

      const response = await this.client.createChat(params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to create chat: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data) {
        throw new FeiShuApiError('Empty response when creating chat');
      }

      return {
        chatId: response.data.chat_id,
        invalidUserIds: response.data.invalid_user_ids,
        invalidBotIds: response.data.invalid_bot_ids,
        invalidOpenIds: response.data.invalid_open_ids,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error creating chat: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get information about a chat
   *
   * @param chatId - ID of the chat to get information for
   * @param userIdType - Optional user ID type for owner_id
   * @returns Detailed chat information
   * @throws FeiShuApiError if API request fails
   */
  async getChatInfo(
    chatId: string,
    userIdType?: string,
  ): Promise<{
    id: string;
    name: string;
    avatar: string;
    description: string;
    ownerId: string;
    ownerIdType: string;
    isExternal: boolean;
    tenantKey: string;
    addMemberPermission?: string;
    shareCardPermission?: string;
    atAllPermission?: string;
    editPermission?: string;
    membershipApproval?: string;
    joinMessageVisibility?: string;
    leaveMessageVisibility?: string;
    type?: string;
    modeType?: string;
    chatTag?: string;
    botManagerIds?: string[];
    i18nNames?: Record<string, string>;
  }> {
    try {
      const params: GetChatInfoParams = {};

      if (userIdType) {
        params.user_id_type = userIdType;
      }

      const response = await this.client.getChatInfo(chatId, params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get chat info: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data) {
        throw new FeiShuApiError('Empty response when getting chat info');
      }

      return {
        id: response.data.chat_id,
        name: response.data.name,
        avatar: response.data.avatar,
        description: response.data.description,
        ownerId: response.data.owner_id,
        ownerIdType: response.data.owner_id_type,
        isExternal: response.data.external,
        tenantKey: response.data.tenant_key,
        addMemberPermission: response.data.add_member_permission,
        shareCardPermission: response.data.share_card_permission,
        atAllPermission: response.data.at_all_permission,
        editPermission: response.data.edit_permission,
        membershipApproval: response.data.membership_approval,
        joinMessageVisibility: response.data.join_message_visibility,
        leaveMessageVisibility: response.data.leave_message_visibility,
        type: response.data.type,
        modeType: response.data.mode_type,
        chatTag: response.data.chat_tag,
        botManagerIds: response.data.bot_manager_ids,
        i18nNames: response.data.i18n_names,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error getting chat info: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Update chat information
   *
   * @param chatId - ID of the chat to update
   * @param options - Chat update options
   * @returns Updated chat ID
   * @throws FeiShuApiError if API request fails
   */
  async updateChat(
    chatId: string,
    options: {
      name?: string;
      description?: string;
      i18nNames?: Record<string, string>;
      onlyOwnerAdd?: boolean;
      shareAllowed?: boolean;
      onlyOwnerAtAll?: boolean;
      onlyOwnerEdit?: boolean;
      joinMessageVisibility?: string;
      leaveMessageVisibility?: string;
      membershipApproval?: string;
      userIdType?: string;
    },
  ): Promise<{ chatId: string }> {
    try {
      const params: UpdateChatParams = {};

      if (options.name !== undefined) {
        params.name = options.name;
      }

      if (options.description !== undefined) {
        params.description = options.description;
      }

      if (options.i18nNames !== undefined) {
        params.i18n_names = options.i18nNames;
      }

      if (options.onlyOwnerAdd !== undefined) {
        params.only_owner_add = options.onlyOwnerAdd;
      }

      if (options.shareAllowed !== undefined) {
        params.share_allowed = options.shareAllowed;
      }

      if (options.onlyOwnerAtAll !== undefined) {
        params.only_owner_at_all = options.onlyOwnerAtAll;
      }

      if (options.onlyOwnerEdit !== undefined) {
        params.only_owner_edit = options.onlyOwnerEdit;
      }

      if (options.joinMessageVisibility !== undefined) {
        params.join_message_visibility = options.joinMessageVisibility;
      }

      if (options.leaveMessageVisibility !== undefined) {
        params.leave_message_visibility = options.leaveMessageVisibility;
      }

      if (options.membershipApproval !== undefined) {
        params.membership_approval = options.membershipApproval;
      }

      if (options.userIdType !== undefined) {
        params.user_id_type = options.userIdType;
      }

      const response = await this.client.updateChat(chatId, params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to update chat: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data) {
        throw new FeiShuApiError('Empty response when updating chat');
      }

      return {
        chatId: response.data.chat_id,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error updating chat: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Add members to a chat
   *
   * @param chatId - ID of the chat to add members to
   * @param idList - List of member IDs to add
   * @param options - Additional options for adding members
   * @returns Response with invalid ID list if any
   * @throws FeiShuApiError if API request fails
   */
  async addChatMembers(
    chatId: string,
    idList: string[],
    options: {
      memberType?: string;
      userIdType?: string;
    } = {},
  ): Promise<{ invalidIdList?: string[] }> {
    try {
      const params: AddChatMembersParams = {
        id_list: idList,
      };

      if (options.memberType !== undefined) {
        params.member_type = options.memberType;
      }

      if (options.userIdType !== undefined) {
        params.user_id_type = options.userIdType;
      }

      const response = await this.client.addChatMembers(chatId, params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to add chat members: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data) {
        throw new FeiShuApiError('Empty response when adding chat members');
      }

      return {
        invalidIdList: response.data.invalid_id_list,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error adding chat members: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

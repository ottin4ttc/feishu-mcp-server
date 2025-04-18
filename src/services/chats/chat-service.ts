/**
 * Chat Service
 *
 * Business logic for FeiShu chat operations.
 */
import { ChatClient } from '@/client/chats/chat-client.js';
import type {
  ChatData,
  ChatListParams,
  ChatSearchParams,
  CreateChatParams,
  CreateChatResponse,
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
}

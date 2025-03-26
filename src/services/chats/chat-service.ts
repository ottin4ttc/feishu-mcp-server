import type { ApiClientConfig } from '@/client/api-client.js';
/**
 * Chat Service
 *
 * Business logic for FeiShu chat operations.
 */
import {
  type Chat,
  ChatClient,
  type ChatListParams,
  type ChatSearchParams,
} from '@/client/chats/chat-client.js';
import { FeiShuApiError } from '../error.js';

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
  chats: Chat[];
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
  async searchChats(options: ChatSearchOptions = {}): Promise<ChatResult> {
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

      return {
        chats: response.data.items,
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
  async getChats(options: ChatListOptions = {}): Promise<ChatResult> {
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

      return {
        chats: response.data.items,
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
}

/**
 * Chat Client
 *
 * Implements FeiShu Chat API operations.
 */
import { ApiClient, type ApiResponse } from '@/client/api-client.js';

/**
 * Common parameter interface for chat API calls
 */
export interface ChatParams {
  pageToken?: string;
  pageSize?: number;
  userIdType?: 'open_id' | 'union_id' | 'user_id';
  [key: string]: unknown;
}

/**
 * Chat search parameters
 */
export interface ChatSearchParams extends ChatParams {
  query?: string;
}

/**
 * Chat list parameters
 */
export type ChatListParams = ChatParams;

/**
 * Chat information
 */
export interface Chat {
  chat_id: string;
  avatar: string;
  name: string;
  description: string;
  owner_id: string;
  owner_id_type: string;
  external: boolean;
  tenant_key: string;
  chat_status?: string;
}

/**
 * Chat response data
 */
export interface ChatResponseData {
  items: Chat[];
  page_token: string;
  has_more: boolean;
}

/**
 * Chat search response
 */
export type ChatSearchResponse = ApiResponse<ChatResponseData>;

/**
 * Chat list response
 */
export type ChatListResponse = ApiResponse<ChatResponseData>;

/**
 * Feishu Chat Client
 */
export class ChatClient extends ApiClient {
  /**
   * Convert parameters to URL query string
   *
   * @param params - Parameters to convert
   * @returns Query string with leading ? if not empty
   */
  private paramsToQueryString(params: Record<string, unknown> = {}): string {
    const queryParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        const paramKey =
          key === 'pageToken'
            ? 'page_token'
            : key === 'pageSize'
              ? 'page_size'
              : key === 'userIdType'
                ? 'user_id_type'
                : key;

        queryParams.append(paramKey, String(value));
      }
    }

    return queryParams.toString() ? `?${queryParams.toString()}` : '';
  }

  /**
   * Search for groups
   *
   * @param params - Search parameters
   * @returns Search results
   */
  async searchChats(
    params: ChatSearchParams = {},
  ): Promise<ChatSearchResponse> {
    try {
      const query = this.paramsToQueryString(params);

      return this.request<ChatResponseData>({
        url: `/open-apis/im/v1/chats/search${query}`,
        method: 'GET',
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get the list of groups that a user or bot is in
   *
   * @param params - List parameters
   * @returns List of chats
   */
  async getChats(params: ChatListParams = {}): Promise<ChatListResponse> {
    try {
      const query = this.paramsToQueryString(params);

      return this.request<ChatResponseData>({
        url: `/open-apis/im/v1/chats${query}`,
        method: 'GET',
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }
}

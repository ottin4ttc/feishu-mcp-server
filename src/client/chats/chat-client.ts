import { ApiClient } from '@/client/api-client.js';
import type {
  ApiResponse,
  ListResponseData,
  PaginationOptions,
} from '@/client/types.js';
/**
 * Chat Client
 *
 * Implements FeiShu Chat API operations.
 */
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
  RemoveChatMembersParams,
  RemoveChatMembersResponse,
  UpdateChatParams,
  UpdateChatResponse,
} from './types/index.js';

/**
 * Feishu Chat Client
 */
export class ChatClient extends ApiClient {
  /**
   * Search for groups
   *
   * @param params - Search parameters
   * @returns Search results
   */
  searchChats = (
    params: ChatSearchParams = {},
  ): Promise<ApiResponse<ListResponseData<ChatData>>> => {
    const { pageSize, pageToken, ...otherParams } = params;
    const pagination: PaginationOptions = {};

    if (pageSize) pagination.pageSize = pageSize;
    if (pageToken) pagination.pageToken = pageToken;

    return this.getList<ListResponseData<ChatData>>(
      '/open-apis/im/v1/chats/search',
      pagination,
      otherParams,
    );
  };

  /**
   * Get the list of groups that a user or bot is in
   *
   * @param params - List parameters
   * @returns List of chats
   */
  getChats = (
    params: ChatListParams = {},
  ): Promise<ApiResponse<ListResponseData<ChatData>>> => {
    const { pageSize, pageToken, ...otherParams } = params;
    const pagination: PaginationOptions = {};

    if (pageSize) pagination.pageSize = pageSize;
    if (pageToken) pagination.pageToken = pageToken;

    return this.getList<ListResponseData<ChatData>>(
      '/open-apis/im/v1/chats',
      pagination,
      otherParams,
    );
  };

  /**
   * Create a new chat
   *
   * @param params - Chat creation parameters
   * @returns Created chat information
   */
  createChat = (
    params: CreateChatParams,
  ): Promise<ApiResponse<CreateChatResponse>> => {
    return this.post<CreateChatResponse>('/open-apis/im/v1/chats', params);
  };

  /**
   * Get information about a chat
   *
   * @param chatId - ID of the chat to get information for
   * @param params - Optional parameters
   * @returns Chat information
   */
  getChatInfo = (
    chatId: string,
    params?: GetChatInfoParams,
  ): Promise<ApiResponse<ChatInfoResponse>> => {
    return this.get<ChatInfoResponse>(
      `/open-apis/im/v1/chats/${chatId}`,
      params as Record<string, unknown>,
    );
  };

  /**
   * Update chat information
   *
   * @param chatId - ID of the chat to update
   * @param params - Chat update parameters
   * @returns Updated chat information
   */
  updateChat = (
    chatId: string,
    params: UpdateChatParams,
  ): Promise<ApiResponse<UpdateChatResponse>> => {
    return this.put<UpdateChatResponse>(
      `/open-apis/im/v1/chats/${chatId}`,
      params,
    );
  };

  /**
   * Add members to a chat
   *
   * @param chatId - ID of the chat to add members to
   * @param params - Parameters for adding members
   * @returns Response with invalid ID list if any
   */
  addChatMembers = (
    chatId: string,
    params: AddChatMembersParams,
  ): Promise<ApiResponse<AddChatMembersResponse>> => {
    return this.post<AddChatMembersResponse>(
      `/open-apis/im/v1/chats/${chatId}/members`,
      params,
    );
  };

  /**
   * Remove members from a chat
   *
   * @param chatId - ID of the chat to remove members from
   * @param params - Parameters for removing members
   * @returns Response with invalid ID list if any
   */
  removeChatMembers = (
    chatId: string,
    params: RemoveChatMembersParams,
  ): Promise<ApiResponse<RemoveChatMembersResponse>> => {
    return this.delete<RemoveChatMembersResponse>(
      `/open-apis/im/v1/chats/${chatId}/members`,
      params,
    );
  };
}

/**
 * Bot Client for FeiShu
 *
 * API client specializing in bot operations
 */
import { ApiClient } from '@/client/api-client.js';
import type { ApiResponse, PaginationOptions } from '@/client/types.js';
import { TokenType } from '@/client/types.js';
import { MessageType } from './types/index.js';
import type {
  EditMessageParams,
  MessageReadUsersParams,
  MessageReadUsersResponse,
  MessageResponse,
  MessageSearchParams,
  MessageSearchResponse,
  MessagesListParams,
  MessagesListResponse,
} from './types/index.js';

/**
 * Bot client for FeiShu
 *
 * Provides methods for sending messages and retrieving bot information
 */
export class BotClient extends ApiClient {
  /**
   * Send message to a chat
   *
   * @param receiveId - Receive ID
   * @param content - Message content
   * @param msgType - Message type
   * @param receiveIdType - Type of the receive ID, defaults to 'chat_id'
   * @returns Message response with ID
   */
  sendMessage = (
    receiveId: string,
    content: string | Record<string, unknown>,
    msgType: MessageType,
    receiveIdType = 'chat_id',
  ): Promise<ApiResponse<MessageResponse>> => {
    let formattedContent: Record<string, unknown>;

    if (msgType === MessageType.TEXT) {
      formattedContent = { text: content };
    } else if (msgType === MessageType.INTERACTIVE) {
      formattedContent =
        typeof content === 'string'
          ? { card: JSON.parse(content) }
          : { card: content };
    } else {
      formattedContent = typeof content === 'string' ? { content } : content;
    }

    return this.post<MessageResponse>(
      '/open-apis/im/v1/messages',
      {
        receive_id: receiveId,
        content: JSON.stringify(formattedContent),
        msg_type: msgType,
      },
      { receive_id_type: receiveIdType },
    );
  };

  /**
   * Get message list from a chat
   *
   * @param params - List parameters with chat_id, pagination, etc.
   * @returns List of messages
   */
  getMessages = (
    params: MessagesListParams,
  ): Promise<ApiResponse<MessagesListResponse>> => {
    const { page_size, page_token, ...otherParams } = params;
    const pagination: PaginationOptions = {};

    if (page_size) pagination.pageSize = page_size;
    if (page_token) pagination.pageToken = page_token;

    return this.getList<MessagesListResponse>(
      '/open-apis/im/v1/messages',
      pagination,
      otherParams,
    );
  };

  /**
   * Reply to a message
   *
   * @param messageId - ID of the message to reply to
   * @param content - Message content
   * @param msgType - Message type
   * @returns Message response with ID
   */
  replyMessage = (
    messageId: string,
    content: string | Record<string, unknown>,
    msgType: MessageType,
  ): Promise<ApiResponse<MessageResponse>> => {
    let formattedContent: Record<string, unknown>;

    if (msgType === MessageType.TEXT) {
      formattedContent = { text: content };
    } else if (msgType === MessageType.INTERACTIVE) {
      formattedContent =
        typeof content === 'string'
          ? { card: JSON.parse(content) }
          : { card: content };
    } else {
      formattedContent = typeof content === 'string' ? { content } : content;
    }

    return this.post<MessageResponse>(
      `/open-apis/im/v1/messages/${messageId}/reply`,
      {
        content: JSON.stringify(formattedContent),
        msg_type: msgType,
      },
    );
  };

  /**
   * Edit a message
   *
   * @param messageId - ID of the message to edit
   * @param content - New message content
   * @param msgType - Message type
   * @returns Message response with ID
   */
  editMessage = (
    messageId: string,
    content: string | Record<string, unknown>,
    msgType: MessageType,
  ): Promise<ApiResponse<MessageResponse>> => {
    let formattedContent: Record<string, unknown>;

    if (msgType === MessageType.TEXT) {
      formattedContent = { text: content };
    } else if (msgType === MessageType.INTERACTIVE) {
      formattedContent =
        typeof content === 'string'
          ? { card: JSON.parse(content) }
          : { card: content };
    } else {
      formattedContent = typeof content === 'string' ? { content } : content;
    }

    return this.put<MessageResponse>(`/open-apis/im/v1/messages/${messageId}`, {
      content: JSON.stringify(formattedContent),
      msg_type: msgType,
    });
  };

  /**
   * Forward a message to another chat
   *
   * @param messageId - ID of the message to forward
   * @param receiveId - ID of the chat to forward the message to
   * @param receiveIdType - Type of the receive ID, defaults to 'chat_id'
   * @returns Message response with ID
   */
  forwardMessage = (
    messageId: string,
    receiveId: string,
    receiveIdType = 'chat_id',
  ): Promise<ApiResponse<MessageResponse>> => {
    return this.post<MessageResponse>(
      `/open-apis/im/v1/messages/${messageId}/forward`,
      {
        receive_id: receiveId,
      },
      { receive_id_type: receiveIdType },
    );
  };

  /**
   * Get users who have read a message
   *
   * @param messageId - ID of the message
   * @param params - Pagination parameters
   * @returns List of users who have read the message
   */
  getMessageReadUsers = (
    messageId: string,
    params?: MessageReadUsersParams,
  ): Promise<ApiResponse<MessageReadUsersResponse>> => {
    const { page_size, page_token } = params || {};
    const pagination: PaginationOptions = {};

    if (page_size) pagination.pageSize = page_size;
    if (page_token) pagination.pageToken = page_token;

    return this.getList<MessageReadUsersResponse>(
      `/open-apis/im/v1/messages/${messageId}/read_users`,
      pagination,
    );
  };

  /**
   * Search messages by keyword
   *
   * @param query - Search keywords
   * @param options - Additional options including pagination
   * @returns Message search results
   * @requires User access token
   */
  searchMessages = (
    query: string,
    options?: Omit<MessageSearchParams, 'query'>,
  ): Promise<ApiResponse<MessageSearchResponse>> => {
    const { page_size, page_token, message_type } = options || {};
    const params: Record<string, any> = { query };

    if (page_size) params.page_size = page_size;
    if (page_token) params.page_token = page_token;
    if (message_type) params.message_type = message_type;

    return this.get<MessageSearchResponse>(
      '/open-apis/im/v1/messages/search',
      params,
      { tokenType: TokenType.USER },
    );
  };
}

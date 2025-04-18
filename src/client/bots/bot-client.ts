/**
 * Bot Client for FeiShu
 *
 * API client specializing in bot operations
 */
import { ApiClient } from '@/client/api-client.js';
import type { ApiResponse, PaginationOptions } from '@/client/types.js';
import { MessageType } from './types/index.js';
import type {
  EditMessageParams,
  MessageResponse,
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
   * @param chatId - Chat ID
   * @param content - Message content
   * @param msgType - Message type
   * @returns Message response with ID
   */
  sendMessage = (
    chatId: string,
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
      '/open-apis/im/v1/messages',
      {
        receive_id: chatId,
        content: JSON.stringify(formattedContent),
        msg_type: msgType,
      },
      { receive_id_type: 'chat_id' },
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
}

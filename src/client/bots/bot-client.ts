/**
 * Bot Client for FeiShu
 *
 * API client specializing in bot operations
 */
import { ApiClient, type ApiResponse } from '@/client/api-client.js';

/**
 * Message types supported by bots
 */
export enum MessageType {
  TEXT = 'text',
  POST = 'post',
  IMAGE = 'image',
  INTERACTIVE = 'interactive',
  SHARE_CHAT = 'share_chat',
  SHARE_USER = 'share_user',
  AUDIO = 'audio',
  MEDIA = 'media',
  FILE = 'file',
  STICKER = 'sticker',
  LOCATION = 'location',
}

/**
 * Bot message response format
 */
export interface MessageResponse {
  message_id: string;
}

/**
 * Bot information response
 */
export interface BotInfoResponse {
  bot: Record<string, unknown>;
}

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
  async sendMessage(
    chatId: string,
    content: string | Record<string, unknown>,
    msgType: MessageType,
  ): Promise<ApiResponse<MessageResponse>> {
    try {
      // Format the message content based on type
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

      return await this.request<MessageResponse>({
        method: 'POST',
        url: '/open-apis/im/v1/messages',
        data: {
          receive_id: chatId,
          content: JSON.stringify(formattedContent),
          msg_type: msgType,
        },
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }
}

import { fillApiPath } from '@/utils/index.js';
/**
 * Bot Client for FeiShu
 *
 * API client specializing in bot operations
 */
import { ApiClient } from '../api-client.js';
import type { ApiResponse } from '../api-client.js';

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

    return this.request<MessageResponse>({
      method: 'POST',
      url: fillApiPath('/open-apis/im/v1/messages'),
      data: {
        receive_id: chatId,
        content: JSON.stringify(formattedContent),
        msg_type: msgType,
      },
    });
  }

  /**
   * Get bot information
   *
   * @returns Bot information
   */
  async getBotInfo(): Promise<ApiResponse<{ bot: Record<string, unknown> }>> {
    return this.request({
      method: 'GET',
      url: fillApiPath('/open-apis/bot/v3/info'),
    });
  }
}

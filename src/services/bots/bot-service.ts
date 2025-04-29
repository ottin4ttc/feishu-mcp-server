import { BotClient, MessageType } from '@/client/index.js';
import type { ApiClientConfig } from '@/client/types.js';
/**
 * Bot Service
 *
 * Business logic for FeiShu bot operations.
 */
import { FeiShuApiError } from '../error.js';
import type { BotCardContentBO, BotMessageResponseBO } from './types/index.js';

/**
 * Bot service for FeiShu
 */
export class BotService {
  private client: BotClient;

  /**
   * Create bot service
   *
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig) {
    this.client = new BotClient(config);
  }

  /**
   * Send text message to a chat
   *
   * @param chatId - Chat ID
   * @param text - Message text
   * @returns Message ID
   */
  async sendTextMessage(
    chatId: string,
    text: string,
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.sendMessage(
        chatId,
        text,
        MessageType.TEXT,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to send message: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.message_id) {
        throw new FeiShuApiError('No message ID returned');
      }

      return {
        messageId: response.data.message_id,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error sending message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Send interactive card message
   *
   * @param chatId - Chat ID
   * @param cardContent - Interactive card JSON content
   * @returns Message ID
   */
  async sendCardMessage(
    chatId: string,
    cardContent: BotCardContentBO,
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.sendMessage(
        chatId,
        cardContent,
        MessageType.INTERACTIVE,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to send card: ${response.msg}`,
          response.code,
        );
      }

      return {
        messageId: response.data?.message_id || '',
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error sending card: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Reply to a message
   *
   * @param messageId - ID of the message to reply to
   * @param text - Message text
   * @returns Message ID
   */
  async replyTextMessage(
    messageId: string,
    text: string,
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.replyMessage(
        messageId,
        text,
        MessageType.TEXT,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to reply to message: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.message_id) {
        throw new FeiShuApiError('No message ID returned');
      }

      return {
        messageId: response.data.message_id,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error replying to message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Reply with an interactive card message
   *
   * @param messageId - ID of the message to reply to
   * @param cardContent - Interactive card JSON content
   * @returns Message ID
   */
  async replyCardMessage(
    messageId: string,
    cardContent: BotCardContentBO,
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.replyMessage(
        messageId,
        cardContent,
        MessageType.INTERACTIVE,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to reply with card: ${response.msg}`,
          response.code,
        );
      }

      return {
        messageId: response.data?.message_id || '',
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error replying with card: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Edit a text message
   *
   * @param messageId - ID of the message to edit
   * @param text - New message text
   * @returns Message ID
   */
  async editTextMessage(
    messageId: string,
    text: string,
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.editMessage(
        messageId,
        text,
        MessageType.TEXT,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to edit message: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.message_id) {
        throw new FeiShuApiError('No message ID returned');
      }

      return {
        messageId: response.data.message_id,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error editing message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Edit an interactive card message
   *
   * @param messageId - ID of the message to edit
   * @param cardContent - New interactive card JSON content
   * @returns Message ID
   */
  async editCardMessage(
    messageId: string,
    cardContent: BotCardContentBO,
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.editMessage(
        messageId,
        cardContent,
        MessageType.INTERACTIVE,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to edit card: ${response.msg}`,
          response.code,
        );
      }

      return {
        messageId: response.data?.message_id || '',
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error editing card: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Forward a message to another chat
   *
   * @param messageId - ID of the message to forward
   * @param receiveId - ID of the chat to forward the message to
   * @param receiveIdType - Type of the receive ID, defaults to 'chat_id'
   * @returns Message ID
   */
  async forwardMessage(
    messageId: string,
    receiveId: string,
    receiveIdType = 'chat_id',
  ): Promise<BotMessageResponseBO> {
    try {
      const response = await this.client.forwardMessage(
        messageId,
        receiveId,
        receiveIdType,
      );

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to forward message: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.message_id) {
        throw new FeiShuApiError('No message ID returned');
      }

      return {
        messageId: response.data.message_id,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error forwarding message: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get users who have read a message
   *
   * @param messageId - ID of the message
   * @param pageSize - Number of items per page
   * @param pageToken - Token for pagination
   * @returns List of users who have read the message
   */
  async getMessageReadUsers(
    messageId: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<{
    items: Array<{
      userId: string;
      userIdType: string;
      readTime: string;
    }>;
    pageToken?: string;
    hasMore: boolean;
  }> {
    try {
      const params: { page_size?: number; page_token?: string } = {};
      if (pageSize) params.page_size = pageSize;
      if (pageToken) params.page_token = pageToken;

      const response = await this.client.getMessageReadUsers(messageId, params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get message read users: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.items) {
        throw new FeiShuApiError('No items returned');
      }

      return {
        items: response.data.items.map((item) => ({
          userId: item.user_id,
          userIdType: item.user_id_type,
          readTime: item.read_time,
        })),
        pageToken: response.data.page_token,
        hasMore: response.data.has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error getting message read users: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Search messages by keyword
   *
   * @param query - Search keywords
   * @param options - Additional options including pagination and message type
   * @returns Message search results in business object format
   */
  async searchMessages(
    query: string,
    options?: {
      pageSize?: number;
      pageToken?: string;
      messageType?: string;
    },
  ): Promise<{
    messages: Array<{
      messageId: string;
      msgType: string;
      createTime: string;
      chatId: string;
      content: string;
      sender: {
        id: string;
        idType: string;
        senderType: string;
      };
    }>;
    pageToken?: string;
    hasMore: boolean;
  }> {
    try {
      const params: {
        page_size?: number;
        page_token?: string;
        message_type?: string;
      } = {};

      if (options?.pageSize) params.page_size = options.pageSize;
      if (options?.pageToken) params.page_token = options.pageToken;
      if (options?.messageType) params.message_type = options.messageType;

      const response = await this.client.searchMessages(query, params);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to search messages: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.items) {
        throw new FeiShuApiError('No items returned');
      }

      return {
        messages: response.data.items.map((item) => ({
          messageId: item.message_id,
          msgType: item.msg_type,
          createTime: item.create_time,
          chatId: item.chat_id,
          content: item.content,
          sender: {
            id: item.sender.id,
            idType: item.sender.id_type,
            senderType: item.sender.sender_type,
          },
        })),
        pageToken: response.data.page_token,
        hasMore: response.data.has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error searching messages: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }
}

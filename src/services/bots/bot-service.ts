import type { ApiClientConfig } from '@/client/api-client.js';
/**
 * Bot Service
 *
 * Business logic for FeiShu bot operations.
 */
import { BotClient, MessageType } from '@/client/bots/bot-client.js';
import { FeiShuApiError } from '../error.js';

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
  async sendTextMessage(chatId: string, text: string): Promise<string> {
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

      return response.data.message_id;
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
    cardContent: Record<string, unknown>,
  ): Promise<string> {
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

      return response.data?.message_id || '';
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
   * Get bot information
   *
   * @returns Bot info
   */
  async getBotInfo() {
    try {
      const response = await this.client.getBotInfo();

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get bot info: ${response.msg}`,
          response.code,
        );
      }

      return response.data?.bot;
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error getting bot info: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

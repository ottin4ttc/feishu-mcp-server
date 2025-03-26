import { FeiShuApiError } from '@/services/error.js';
/**
 * Bot Tools
 *
 * Defines MCP tools for FeiShu bot operations.
 */
import { z } from 'zod';
import type { ToolRegistryParams } from './index.js';

/**
 * Register bot tools with the MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerBotTools(params: ToolRegistryParams): void {
  const { server, services, logger } = params;

  // Send text message
  server.tool(
    'send_feishu_text_message',
    'Send a text message to a FeiShu chat via bot',
    {
      chatId: z.string().describe('The chat ID to send the message to'),
      text: z.string().describe('The text content of the message'),
    },
    async ({ chatId, text }) => {
      try {
        logger.info(`Sending message to chat ${chatId}`);
        const messageId = await services.bots.sendTextMessage(chatId, text);

        return {
          content: [
            {
              type: 'text' as const,
              text: `Message sent successfully. Message ID: ${messageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error sending message: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Send interactive card
  server.tool(
    'send_feishu_card',
    'Send an interactive card to a FeiShu chat',
    {
      chatId: z.string().describe('The chat ID to send the card to'),
      cardContent: z.string().describe('The card content as JSON string'),
    },
    async ({ chatId, cardContent }) => {
      try {
        let cardJson: object;

        // Parse card content
        try {
          cardJson = JSON.parse(cardContent);
        } catch (e) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Invalid card JSON: ${e instanceof Error ? e.message : String(e)}`,
              },
            ],
          };
        }

        logger.info(`Sending card to chat ${chatId}`);
        const messageId = await services.bots.sendCardMessage(chatId, cardJson);

        return {
          content: [
            {
              type: 'text' as const,
              text: `Card sent successfully. Message ID: ${messageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error sending card: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

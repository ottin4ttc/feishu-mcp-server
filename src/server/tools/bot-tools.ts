import {
  TOOL_EDIT_CARD,
  TOOL_EDIT_TEXT_MESSAGE,
  TOOL_FORWARD_MESSAGE,
  TOOL_GET_MESSAGE_READ_USERS,
  TOOL_REPLY_CARD,
  TOOL_REPLY_TEXT_MESSAGE,
  TOOL_SEARCH_MESSAGES,
  TOOL_SEND_CARD,
  TOOL_SEND_TEXT_MESSAGE,
} from '@/consts/index.js';
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
    TOOL_SEND_TEXT_MESSAGE,
    'Send a text message to a FeiShu chat via bot',
    {
      receiveId: z.string().describe('The ID to send the message to'),
      text: z.string().describe('The text content of the message'),
      receiveIdType: z
        .enum(['open_id', 'union_id', 'user_id', 'email', 'chat_id'])
        .optional()
        .default('chat_id')
        .describe('Type of the receive ID, defaults to chat_id'),
    },
    async ({ receiveId, text, receiveIdType }) => {
      try {
        logger.info(`Sending message to ${receiveId}`);
        const messageId = await services.bots.sendTextMessage(
          receiveId,
          text,
          receiveIdType,
        );

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
    TOOL_SEND_CARD,
    'Send an interactive card to a FeiShu chat',
    {
      receiveId: z.string().describe('The ID to send the card to'),
      cardContent: z.string().describe('The card content as JSON string'),
      receiveIdType: z
        .enum(['open_id', 'union_id', 'user_id', 'email', 'chat_id'])
        .optional()
        .default('chat_id')
        .describe('Type of the receive ID, defaults to chat_id'),
    },
    async ({ receiveId, cardContent, receiveIdType }) => {
      try {
        let cardJson: Record<string, unknown>;

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

        logger.info(`Sending card to ${receiveId}`);
        const messageId = await services.bots.sendCardMessage(
          receiveId,
          cardJson,
          receiveIdType,
        );

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

  // Reply with text message
  server.tool(
    TOOL_REPLY_TEXT_MESSAGE,
    'Reply to a FeiShu message with text',
    {
      messageId: z.string().describe('The message ID to reply to'),
      text: z.string().describe('The text content of the reply'),
    },
    async ({ messageId, text }) => {
      try {
        logger.info(`Replying to message ${messageId}`);
        const replyMessageId = await services.bots.replyTextMessage(
          messageId,
          text,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Reply sent successfully. Message ID: ${replyMessageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error replying to message: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Reply with interactive card
  server.tool(
    TOOL_REPLY_CARD,
    'Reply to a FeiShu message with an interactive card',
    {
      messageId: z.string().describe('The message ID to reply to'),
      cardContent: z.string().describe('The card content as JSON string'),
    },
    async ({ messageId, cardContent }) => {
      try {
        let cardJson: Record<string, unknown>;

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

        logger.info(`Replying to message ${messageId} with card`);
        const replyMessageId = await services.bots.replyCardMessage(
          messageId,
          cardJson,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Card reply sent successfully. Message ID: ${replyMessageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error replying with card: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Edit text message
  server.tool(
    TOOL_EDIT_TEXT_MESSAGE,
    'Edit a FeiShu text message',
    {
      messageId: z.string().describe('The message ID to edit'),
      text: z.string().describe('The new text content of the message'),
    },
    async ({ messageId, text }) => {
      try {
        logger.info(`Editing message ${messageId}`);
        const editedMessageId = await services.bots.editTextMessage(
          messageId,
          text,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Message edited successfully. Message ID: ${editedMessageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error editing message: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Edit interactive card
  server.tool(
    TOOL_EDIT_CARD,
    'Edit a FeiShu interactive card message',
    {
      messageId: z.string().describe('The message ID to edit'),
      cardContent: z.string().describe('The new card content as JSON string'),
    },
    async ({ messageId, cardContent }) => {
      try {
        let cardJson: Record<string, unknown>;

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

        logger.info(`Editing message ${messageId} with card`);
        const editedMessageId = await services.bots.editCardMessage(
          messageId,
          cardJson,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Card message edited successfully. Message ID: ${editedMessageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error editing card message: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_FORWARD_MESSAGE,
    'Forward a FeiShu message to another chat',
    {
      messageId: z.string().describe('The message ID to forward'),
      receiveId: z
        .string()
        .describe('The ID of the chat to forward the message to'),
      receiveIdType: z
        .string()
        .optional()
        .default('chat_id')
        .describe('The type of the receive ID, defaults to chat_id'),
    },
    async ({ messageId, receiveId, receiveIdType }) => {
      try {
        logger.info(`Forwarding message ${messageId} to ${receiveId}`);
        const forwardedMessageId = await services.bots.forwardMessage(
          messageId,
          receiveId,
          receiveIdType,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Message forwarded successfully. Message ID: ${forwardedMessageId}`,
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error forwarding message: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_GET_MESSAGE_READ_USERS,
    'Get users who have read a FeiShu message',
    {
      messageId: z.string().describe('The message ID to get read status for'),
      pageSize: z
        .number()
        .optional()
        .describe('Number of items per page, default is 20'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ messageId, pageSize, pageToken }) => {
      try {
        logger.info(`Getting read users for message ${messageId}`);
        const readUsers = await services.bots.getMessageReadUsers(
          messageId,
          pageSize,
          pageToken,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Message read by ${readUsers.items.length} users.`,
            },
            {
              type: 'json' as const,
              json: {
                items: readUsers.items,
                pageToken: readUsers.pageToken,
                hasMore: readUsers.hasMore,
              },
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting message read users: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_SEARCH_MESSAGES,
    'Search FeiShu messages by keyword',
    {
      query: z.string().describe('Search keywords to find messages'),
      messageType: z
        .string()
        .optional()
        .describe('Type of messages to search for'),
      pageSize: z
        .number()
        .optional()
        .describe('Number of items per page, default is 20'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ query, messageType, pageSize, pageToken }) => {
      try {
        logger.info(`Searching messages with query: ${query}`);
        const searchResults = await services.bots.searchMessages(query, {
          messageType,
          pageSize,
          pageToken,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: `Found ${searchResults.messages.length} messages matching "${query}".`,
            },
            {
              type: 'json' as const,
              json: {
                messages: searchResults.messages,
                pageToken: searchResults.pageToken,
                hasMore: searchResults.hasMore,
              },
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error searching messages: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

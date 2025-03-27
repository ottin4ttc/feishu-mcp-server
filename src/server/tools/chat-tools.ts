import { TOOL_GET_CHATS, TOOL_SEARCH_CHATS } from '@/consts/index.js';
import { FeiShuApiError } from '@/services/error.js';
/**
 * Chat Tools Registry
 *
 * This module registers all Chat-related tools with the MCP server.
 */
import { z } from 'zod';
import type { ToolRegistryParams } from './index.js';

/**
 * Register all Chat-related tools with the MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerChatTools(params: ToolRegistryParams): void {
  const { server, services, logger } = params;

  logger.info('Registering chat tools');

  // Search chats tool
  server.tool(
    TOOL_SEARCH_CHATS,
    'Search for groups visible to the user or bot',
    {
      query: z.string().optional().describe('Search keyword'),
      page_token: z
        .string()
        .optional()
        .describe('Pagination token, leave empty for first request'),
      page_size: z
        .number()
        .optional()
        .describe('Page size, default is 10, maximum is 100'),
      user_id_type: z
        .enum(['open_id', 'union_id', 'user_id'])
        .optional()
        .describe('User ID type'),
    },
    async ({ query, page_token, page_size, user_id_type }) => {
      try {
        logger.info(`Searching chats with query: ${query || '(empty)'}`);
        const result = await services.chats.searchChats({
          query,
          pageToken: page_token,
          pageSize: page_size,
          userIdType: user_id_type,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  chats: result.chats,
                  page_token: result.pageToken,
                  has_more: result.hasMore,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `Error searching chats: ${error.message}`;
        } else {
          logger.error('Failed to search chats:', error);
          errorMessage = `Error searching chats: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get chats tool
  server.tool(
    TOOL_GET_CHATS,
    'Get the list of groups that the user or bot belongs to',
    {
      page_token: z
        .string()
        .optional()
        .describe('Pagination token, leave empty for first request'),
      page_size: z
        .number()
        .optional()
        .describe('Page size, default is 10, maximum is 100'),
      user_id_type: z
        .enum(['open_id', 'union_id', 'user_id'])
        .optional()
        .describe('User ID type'),
    },
    async ({ page_token, page_size, user_id_type }) => {
      try {
        logger.info('Getting chats for user/bot');
        const result = await services.chats.getChats({
          pageToken: page_token,
          pageSize: page_size,
          userIdType: user_id_type,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  chats: result.chats,
                  page_token: result.pageToken,
                  has_more: result.hasMore,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `Error getting chats: ${error.message}`;
        } else {
          logger.error('Failed to get chats:', error);
          errorMessage = `Error getting chats: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

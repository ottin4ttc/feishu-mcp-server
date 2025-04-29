/**
 * User Tools
 */

import { z } from 'zod';
import {
  TOOL_GET_USER_INFO,
  TOOL_GET_USER_LIST,
  TOOL_SEARCH_USERS,
} from '../../consts/index.js';
import { FeiShuApiError } from '../../services/error.js';
import type { ToolRegistryParams } from './index.js';

/**
 * Register user tools
 */
export function registerUserTools({
  server,
  services,
  logger,
}: ToolRegistryParams) {
  server.tool(
    TOOL_GET_USER_INFO,
    'Get information about a FeiShu user',
    {
      userId: z
        .string()
        .describe('The ID of the user to get information about'),
      userIdType: z
        .enum(['open_id', 'union_id', 'user_id'])
        .default('open_id')
        .describe('The type of user ID provided (open_id, union_id, user_id)'),
    },
    async ({ userId, userIdType }) => {
      try {
        logger.info(`Getting user info for user ${userId} (${userIdType})`);
        const userInfo = await services.users.getUserInfo(userId, userIdType);

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(userInfo, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting user info: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_GET_USER_LIST,
    'Get a list of FeiShu users in a department',
    {
      departmentId: z
        .string()
        .describe('The ID of the department to get users from'),
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of users to return per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ departmentId, pageSize, pageToken }) => {
      try {
        logger.info(`Getting user list for department ${departmentId}`);
        const userList = await services.users.getUserList(
          departmentId,
          pageSize,
          pageToken,
        );

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(userList, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting user list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_SEARCH_USERS,
    'Search FeiShu users by keyword',
    {
      query: z.string().describe('Search keyword to find users'),
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of users to return per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ query, pageSize, pageToken }) => {
      try {
        logger.info(`Searching users with query: ${query}`);
        const searchResults = await services.users.searchUsers(query, {
          pageSize,
          pageToken,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(searchResults, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error searching users: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

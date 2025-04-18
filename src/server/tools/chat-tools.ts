import {
  TOOL_ADD_CHAT_MEMBERS,
  TOOL_CREATE_CHAT,
  TOOL_GET_CHATS,
  TOOL_GET_CHAT_INFO,
  TOOL_SEARCH_CHATS,
  TOOL_UPDATE_CHAT,
} from '@/consts/index.js';
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
          isError: false,
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
          content: [{ type: 'text', text: errorMessage }],
          isError: true,
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
          isError: false,
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
          content: [{ type: 'text', text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    TOOL_CREATE_CHAT,
    'Create a new chat group',
    {
      name: z.string().describe('Name of the chat group'),
      description: z
        .string()
        .optional()
        .describe('Description of the chat group'),
      user_ids: z
        .array(z.string())
        .optional()
        .describe('List of user IDs to add to the chat'),
      bot_ids: z
        .array(z.string())
        .optional()
        .describe('List of bot IDs to add to the chat'),
      open_ids: z
        .array(z.string())
        .optional()
        .describe('List of open IDs to add to the chat'),
      only_owner_add: z
        .boolean()
        .optional()
        .describe('Whether only the owner can add members'),
      share_allowed: z
        .boolean()
        .optional()
        .describe('Whether sharing is allowed'),
      only_owner_at_all: z
        .boolean()
        .optional()
        .describe('Whether only the owner can @all'),
      only_owner_edit: z
        .boolean()
        .optional()
        .describe('Whether only the owner can edit chat info'),
      join_message_visibility: z
        .string()
        .optional()
        .describe('Join message visibility setting'),
      leave_message_visibility: z
        .string()
        .optional()
        .describe('Leave message visibility setting'),
      membership_approval: z
        .string()
        .optional()
        .describe('Membership approval setting'),
      external_ids: z
        .array(z.string())
        .optional()
        .describe('List of external IDs'),
      user_id_type: z.string().optional().describe('User ID type'),
    },
    async (args) => {
      const {
        name,
        description,
        user_ids,
        bot_ids,
        open_ids,
        only_owner_add,
        share_allowed,
        only_owner_at_all,
        only_owner_edit,
        join_message_visibility,
        leave_message_visibility,
        membership_approval,
        external_ids,
        user_id_type,
      } = args;
      try {
        logger.info(`Creating chat with name: ${name}`);
        const result = await services.chats.createChat(name, {
          description,
          user_ids,
          bot_ids,
          open_ids,
          only_owner_add,
          share_allowed,
          only_owner_at_all,
          only_owner_edit,
          join_message_visibility,
          leave_message_visibility,
          membership_approval,
          external_ids,
          user_id_type,
        });

        return {
          content: [
            {
              type: 'text',
              text: `Chat created successfully with ID: ${result.chatId}`,
            },
            {
              type: 'json',
              json: {
                chat_id: result.chatId,
                invalid_user_ids: result.invalidUserIds || [],
                invalid_bot_ids: result.invalidBotIds || [],
                invalid_open_ids: result.invalidOpenIds || [],
              },
            },
          ],
          isError: false,
        };
      } catch (error) {
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `Error creating chat: ${error.message}`;
        } else {
          logger.error('Failed to create chat:', error);
          errorMessage = `Error creating chat: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text', text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    TOOL_GET_CHAT_INFO,
    'Get information about a chat',
    {
      chat_id: z.string().describe('ID of the chat to get information for'),
      user_id_type: z.string().optional().describe('User ID type for owner_id'),
    },
    async (args) => {
      const { chat_id, user_id_type } = args;
      try {
        logger.info(`Getting info for chat: ${chat_id}`);
        const chatInfo = await services.chats.getChatInfo(
          chat_id,
          user_id_type,
        );

        return {
          content: [
            {
              type: 'text',
              text: `Chat information retrieved successfully for: ${chatInfo.name}`,
            },
            {
              type: 'json',
              json: {
                id: chatInfo.id,
                name: chatInfo.name,
                avatar: chatInfo.avatar,
                description: chatInfo.description,
                owner_id: chatInfo.ownerId,
                owner_id_type: chatInfo.ownerIdType,
                is_external: chatInfo.isExternal,
                tenant_key: chatInfo.tenantKey,
                add_member_permission: chatInfo.addMemberPermission,
                share_card_permission: chatInfo.shareCardPermission,
                at_all_permission: chatInfo.atAllPermission,
                edit_permission: chatInfo.editPermission,
                membership_approval: chatInfo.membershipApproval,
                join_message_visibility: chatInfo.joinMessageVisibility,
                leave_message_visibility: chatInfo.leaveMessageVisibility,
                type: chatInfo.type,
                mode_type: chatInfo.modeType,
                chat_tag: chatInfo.chatTag,
                bot_manager_ids: chatInfo.botManagerIds,
                i18n_names: chatInfo.i18nNames,
              },
            },
          ],
          isError: false,
        };
      } catch (error) {
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `Error getting chat info: ${error.message}`;
        } else {
          logger.error('Failed to get chat info:', error);
          errorMessage = `Error getting chat info: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text', text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    TOOL_UPDATE_CHAT,
    'Update chat information',
    {
      chat_id: z.string().describe('ID of the chat to update'),
      name: z.string().optional().describe('New name for the chat'),
      description: z
        .string()
        .optional()
        .describe('New description for the chat'),
      i18n_names: z
        .record(z.string())
        .optional()
        .describe('Internationalized names for the chat'),
      only_owner_add: z
        .boolean()
        .optional()
        .describe('Whether only the owner can add members'),
      share_allowed: z
        .boolean()
        .optional()
        .describe('Whether sharing is allowed'),
      only_owner_at_all: z
        .boolean()
        .optional()
        .describe('Whether only the owner can @all'),
      only_owner_edit: z
        .boolean()
        .optional()
        .describe('Whether only the owner can edit chat info'),
      join_message_visibility: z
        .string()
        .optional()
        .describe('Join message visibility setting'),
      leave_message_visibility: z
        .string()
        .optional()
        .describe('Leave message visibility setting'),
      membership_approval: z
        .string()
        .optional()
        .describe('Membership approval setting'),
      user_id_type: z.string().optional().describe('User ID type'),
    },
    async (args) => {
      const {
        chat_id,
        name,
        description,
        i18n_names,
        only_owner_add,
        share_allowed,
        only_owner_at_all,
        only_owner_edit,
        join_message_visibility,
        leave_message_visibility,
        membership_approval,
        user_id_type,
      } = args;

      try {
        logger.info(`Updating chat: ${chat_id}`);

        const result = await services.chats.updateChat(chat_id, {
          name,
          description,
          i18nNames: i18n_names,
          onlyOwnerAdd: only_owner_add,
          shareAllowed: share_allowed,
          onlyOwnerAtAll: only_owner_at_all,
          onlyOwnerEdit: only_owner_edit,
          joinMessageVisibility: join_message_visibility,
          leaveMessageVisibility: leave_message_visibility,
          membershipApproval: membership_approval,
          userIdType: user_id_type,
        });

        return {
          content: [
            {
              type: 'text',
              text: `Chat updated successfully with ID: ${result.chatId}`,
            },
            {
              type: 'json',
              json: {
                chat_id: result.chatId,
              },
            },
          ],
          isError: false,
        };
      } catch (error) {
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `Error updating chat: ${error.message}`;
        } else {
          logger.error('Failed to update chat:', error);
          errorMessage = `Error updating chat: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text', text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    TOOL_ADD_CHAT_MEMBERS,
    'Add members to a chat',
    {
      chat_id: z.string().describe('ID of the chat to add members to'),
      id_list: z.array(z.string()).describe('List of member IDs to add'),
      member_type: z
        .string()
        .optional()
        .describe('Type of members being added (user/bot)'),
      user_id_type: z
        .string()
        .optional()
        .describe('User ID type for the members'),
    },
    async (args) => {
      const { chat_id, id_list, member_type, user_id_type } = args;
      try {
        logger.info(`Adding members to chat: ${chat_id}`);
        const result = await services.chats.addChatMembers(chat_id, id_list, {
          memberType: member_type,
          userIdType: user_id_type,
        });

        return {
          content: [
            {
              type: 'text',
              text: `Members added successfully to chat: ${chat_id}`,
            },
            {
              type: 'json',
              json: {
                invalid_id_list: result.invalidIdList || [],
              },
            },
          ],
          isError: false,
        };
      } catch (error) {
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `Error adding chat members: ${error.message}`;
        } else {
          logger.error('Failed to add chat members:', error);
          errorMessage = `Error adding chat members: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text', text: errorMessage }],
          isError: true,
        };
      }
    },
  );
}

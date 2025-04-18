/**
 * Task Tools
 */

import { z } from 'zod';
import { TOOL_CREATE_TASK, TOOL_GET_TASK_LIST } from '../../consts/index.js';
import { FeiShuApiError } from '../../services/error.js';
import type { ToolRegistryParams } from './index.js';

/**
 * Register task tools
 */
export function registerTaskTools({
  server,
  services,
  logger,
}: ToolRegistryParams) {
  server.tool(
    TOOL_GET_TASK_LIST,
    'Get a list of FeiShu tasks',
    {
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of tasks to return per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ pageSize, pageToken }) => {
      try {
        logger.info('Getting task list');
        const taskList = await services.tasks.getTaskList(pageSize, pageToken);

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(taskList, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting task list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_CREATE_TASK,
    'Create a new FeiShu task',
    {
      summary: z.string().describe('Task summary/title'),
      description: z.string().optional().describe('Task description'),
      due: z
        .object({
          date: z.string().optional().describe('Due date in YYYY-MM-DD format'),
          timestamp: z
            .string()
            .optional()
            .describe('Due timestamp in milliseconds'),
          timezone: z.string().optional().describe('Timezone for the due date'),
        })
        .optional()
        .describe('Task due date information'),
      origin: z
        .object({
          platformI18nName: z.string().optional().describe('Platform name'),
        })
        .optional()
        .describe('Task origin information'),
      extra: z.record(z.unknown()).optional().describe('Additional task data'),
    },
    async ({ summary, description, due, origin, extra }) => {
      try {
        logger.info(`Creating task: ${summary}`);
        const task = await services.tasks.createTask({
          summary,
          description,
          due,
          origin,
          extra,
        });

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(task, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error creating task: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

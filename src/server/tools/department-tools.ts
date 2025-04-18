/**
 * Department Tools
 */

import { z } from 'zod';
import {
  TOOL_GET_DEPARTMENT_INFO,
  TOOL_GET_DEPARTMENT_LIST,
} from '../../consts/index.js';
import { FeiShuApiError } from '../../services/error.js';
import type { ToolRegistryParams } from './index.js';

/**
 * Register department tools
 */
export function registerDepartmentTools({
  server,
  services,
  logger,
}: ToolRegistryParams) {
  server.tool(
    TOOL_GET_DEPARTMENT_INFO,
    'Get information about a FeiShu department',
    {
      departmentId: z
        .string()
        .describe('The ID of the department to get information about'),
      departmentIdType: z
        .enum(['open_department_id', 'department_id'])
        .default('department_id')
        .describe(
          'The type of department ID provided (open_department_id, department_id)',
        ),
    },
    async ({ departmentId, departmentIdType }) => {
      try {
        logger.info(
          `Getting department info for department ${departmentId} (${departmentIdType})`,
        );
        const departmentInfo = await services.departments.getDepartmentInfo(
          departmentId,
          departmentIdType,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(departmentInfo, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting department info: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  server.tool(
    TOOL_GET_DEPARTMENT_LIST,
    'Get a list of FeiShu departments',
    {
      parentDepartmentId: z
        .string()
        .optional()
        .describe(
          'The ID of the parent department to get sub-departments from',
        ),
      pageSize: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe('Number of departments to return per page (1-100)'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async ({ parentDepartmentId, pageSize, pageToken }) => {
      try {
        logger.info(
          `Getting department list${parentDepartmentId ? ` for parent department ${parentDepartmentId}` : ''}`,
        );
        const departmentList = await services.departments.getDepartmentList(
          parentDepartmentId,
          pageSize,
          pageToken,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(departmentList, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error getting department list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

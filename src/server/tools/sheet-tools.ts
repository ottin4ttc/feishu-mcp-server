import {
  TOOL_GET_SHEET_META,
  TOOL_GET_SHEET_RECORD,
  TOOL_GET_SHEET_RECORDS,
  TOOL_GET_SHEET_TABLES,
  TOOL_GET_SHEET_VIEW,
  TOOL_GET_SHEET_VIEWS,
} from '@/consts/index.js';
/**
 * Sheet Tools
 *
 * Defines MCP tools for FeiShu sheet operations.
 */
import { FeiShuApiError } from '@/services/error.js';
import { z } from 'zod';
import type { ToolRegistryParams } from './index.js';

/**
 * Register sheet tools with the MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerSheetTools(params: ToolRegistryParams): void {
  const { server, services, logger } = params;

  // Get sheet metadata
  server.tool(
    TOOL_GET_SHEET_META,
    'Retrieve metadata for a FeiShu Bitable (Sheet)',
    {
      appToken: z
        .string()
        .describe(
          'The base ID of the FeiShu Bitable to fetch, typically found in a URL like feishu.cn/base/<appToken>',
        ),
    },
    async ({ appToken }) => {
      try {
        logger.info(`Getting metadata for Bitable ${appToken}`);
        const info = await services.sheets.getSheetMetadata(appToken);

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(info, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving Bitable metadata: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get tables list
  server.tool(
    TOOL_GET_SHEET_TABLES,
    'Retrieve tables list from a FeiShu Bitable (Sheet)',
    {
      appToken: z
        .string()
        .describe(
          'The base ID of the FeiShu Bitable to fetch tables from, typically found in a URL like feishu.cn/base/<appToken>',
        ),
      pageSize: z
        .number()
        .optional()
        .describe(
          'Number of tables to return per page (default: 20, max: 100)',
        ),
      pageToken: z
        .string()
        .optional()
        .describe('Token for pagination, obtained from previous response'),
    },
    async ({ appToken, pageSize, pageToken }) => {
      try {
        logger.info(`Getting tables list for Bitable ${appToken}`);
        const tablesList = await services.sheets.getTablesList(
          appToken,
          pageSize,
          pageToken,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(tablesList, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving tables list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get views list
  server.tool(
    TOOL_GET_SHEET_VIEWS,
    'Retrieve views list from a table in a FeiShu Bitable (Sheet)',
    {
      appToken: z
        .string()
        .describe(
          'The base ID of the FeiShu Bitable, typically found in a URL like feishu.cn/base/<appToken>',
        ),
      tableId: z.string().describe('The ID of the table to fetch views from'),
      pageSize: z
        .number()
        .optional()
        .describe('Number of views to return per page (default: 20, max: 100)'),
      pageToken: z
        .string()
        .optional()
        .describe('Token for pagination, obtained from previous response'),
    },
    async ({ appToken, tableId, pageSize, pageToken }) => {
      try {
        logger.info(
          `Getting views list for table ${tableId} in Bitable ${appToken}`,
        );
        const viewsList = await services.sheets.getViewsList(
          appToken,
          tableId,
          pageSize,
          pageToken,
        );

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(viewsList, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving views list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get view details
  server.tool(
    TOOL_GET_SHEET_VIEW,
    'Retrieve details of a specific view from a table in a FeiShu Bitable (Sheet)',
    {
      appToken: z
        .string()
        .describe(
          'The base ID of the FeiShu Bitable, typically found in a URL like feishu.cn/base/<appToken>',
        ),
      tableId: z
        .string()
        .describe('The ID of the table that contains the view'),
      viewId: z.string().describe('The ID of the view to retrieve details for'),
    },
    async ({ appToken, tableId, viewId }) => {
      try {
        logger.info(
          `Getting view details for view ${viewId} in table ${tableId} in Bitable ${appToken}`,
        );
        const viewInfo = await services.sheets.getView(
          appToken,
          tableId,
          viewId,
        );

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(viewInfo, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving view details: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get records list
  server.tool(
    TOOL_GET_SHEET_RECORDS,
    'Retrieve records from a table in a FeiShu Bitable (Sheet)',
    {
      appToken: z
        .string()
        .describe(
          'The base ID of the FeiShu Bitable, typically found in a URL like feishu.cn/base/<appToken>',
        ),
      tableId: z.string().describe('The ID of the table to fetch records from'),
      viewId: z
        .string()
        .optional()
        .describe('The view ID (optional, uses default view if not specified)'),
      fieldIds: z
        .array(z.string())
        .optional()
        .describe(
          'List of field IDs to include (optional, returns all fields if not specified)',
        ),
      filter: z
        .string()
        .optional()
        .describe('Filter condition in FQL format (optional)'),
      sort: z
        .string()
        .optional()
        .describe('Sort condition in JSON format (optional)'),
      pageSize: z
        .number()
        .optional()
        .describe(
          'Number of records to return per page (default: 20, max: 100)',
        ),
      pageToken: z
        .string()
        .optional()
        .describe('Token for pagination, obtained from previous response'),
    },
    async ({
      appToken,
      tableId,
      viewId,
      fieldIds,
      filter,
      sort,
      pageSize,
      pageToken,
    }) => {
      try {
        logger.info(
          `Getting records list for table ${tableId} in Bitable ${appToken}`,
        );
        const recordsList = await services.sheets.getRecordsList(
          appToken,
          tableId,
          viewId,
          fieldIds,
          filter,
          sort,
          pageSize,
          pageToken,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(recordsList, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving records list: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get single record
  server.tool(
    TOOL_GET_SHEET_RECORD,
    'Retrieve a single record from a table in a FeiShu Bitable (Sheet)',
    {
      appToken: z
        .string()
        .describe(
          'The base ID of the FeiShu Bitable, typically found in a URL like feishu.cn/base/<appToken>',
        ),
      tableId: z
        .string()
        .describe('The ID of the table that contains the record'),
      recordId: z.string().describe('The ID of the record to retrieve'),
      fieldIds: z
        .array(z.string())
        .optional()
        .describe(
          'List of field IDs to include (optional, returns all fields if not specified)',
        ),
    },
    async ({ appToken, tableId, recordId, fieldIds }) => {
      try {
        logger.info(
          `Getting record ${recordId} from table ${tableId} in Bitable ${appToken}`,
        );
        const record = await services.sheets.getRecord(
          appToken,
          tableId,
          recordId,
          fieldIds,
        );

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(record, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving record: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

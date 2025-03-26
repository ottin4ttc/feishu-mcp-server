import { FeiShuApiError } from '@/services/error.js';
/**
 * Document Tools
 *
 * Defines MCP tools for FeiShu document operations.
 */
import { z } from 'zod';
import type { ToolRegistryParams } from './index.js';

/**
 * Register document tools with the MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerDocumentTools(params: ToolRegistryParams): void {
  const { server, services, logger } = params;

  // Get document raw content
  server.tool(
    'get_feishu_doc_raw',
    'Retrieve raw content from a FeiShu document by ID',
    {
      docId: z
        .string()
        .describe(
          'The document ID of the FeiShu file to fetch, typically found in a URL like feishu.cn/wiki/<documentId>...',
        ),
    },
    async ({ docId }) => {
      try {
        logger.info(`Reading FeiShu document ${docId}`);
        const content = await services.documents.getDocumentContent(docId);

        return {
          content: [{ type: 'text' as const, text: content }],
        };
      } catch (error) {
        // Create appropriate error message based on error type
        let errorMessage: string;

        if (error instanceof FeiShuApiError) {
          // Handle specific FeiShu API errors
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `FeiShu API Error: ${error.message}`;
        } else {
          // Handle generic errors
          logger.error(`Failed to fetch document ${docId}:`, error);
          errorMessage = `Error fetching document: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Get document metadata
  server.tool(
    'get_feishu_doc_info',
    'Retrieve metadata for a FeiShu document',
    {
      docId: z.string().describe('The document ID to get information about'),
    },
    async ({ docId }) => {
      try {
        logger.info(`Getting metadata for document ${docId}`);
        const info = await services.documents.getDocumentInfo(docId);

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(info, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof FeiShuApiError
            ? `FeiShu API Error: ${error.message}`
            : `Error retrieving document info: ${error}`;

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

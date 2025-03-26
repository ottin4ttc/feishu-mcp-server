/**
 * Document Info Tools
 *
 * Provides MCP tools for retrieving FeiShu document information and content.
 */
import { z } from 'zod';
import type { ToolRegistryParams } from './index.js';

// Type guard function for error checking
function isFeiShuApiError(
  error: unknown,
): error is { name: string; code?: number; message: string } {
  return (
    error !== null &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'FeiShuApiError' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

/**
 * Register document info tools with MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerDocumentInfoTools(params: ToolRegistryParams): void {
  const { server, services, logger } = params;

  // Document metadata tool
  server.tool(
    'get_feishu_doc_info_v2',
    'Retrieve metadata from a FeiShu document',
    {
      documentId: z
        .string()
        .describe('Document ID, typically found in the URL'),
    },
    async ({ documentId }) => {
      try {
        logger.info(`Retrieving document metadata: ${documentId}`);
        const docInfo = await services.documents.getDocumentInfo(documentId);

        return {
          content: [
            { type: 'text' as const, text: JSON.stringify(docInfo, null, 2) },
          ],
        };
      } catch (error) {
        // Create appropriate error message
        let errorMessage: string;

        if (isFeiShuApiError(error)) {
          // Handle specific FeiShu API errors
          logger.error(
            `FeiShu API Error (${error.code || 'unknown'}): ${error.message}`,
          );
          errorMessage = `FeiShu API Error: ${error.message}`;
        } else {
          // Handle generic errors
          logger.error(`Failed to fetch document info ${documentId}:`, error);
          errorMessage = `Error retrieving document info: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );

  // Document content tool
  server.tool(
    'get_feishu_doc_content_v2',
    'Retrieve plain text content from a FeiShu document',
    {
      documentId: z
        .string()
        .describe('Document ID, typically found in the URL'),
      lang: z
        .number()
        .optional()
        .describe('Language option (0: Chinese, 1: English), default is 0'),
    },
    async ({ documentId, lang = 0 }) => {
      try {
        logger.info(`Retrieving document content: ${documentId}`);
        // Note: We don't pass lang parameter since DocumentService doesn't accept it
        const content = await services.documents.getDocumentContent(documentId);

        return {
          content: [{ type: 'text' as const, text: content }],
        };
      } catch (error) {
        let errorMessage: string;

        if (isFeiShuApiError(error)) {
          errorMessage = `FeiShu API Error: ${error.message}`;
        } else {
          errorMessage = `Error retrieving document content: ${error instanceof Error ? error.message : String(error)}`;
        }

        logger.error(errorMessage);

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
        };
      }
    },
  );
}

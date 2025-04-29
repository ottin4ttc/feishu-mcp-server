import {
  TOOL_DELETE_DOCUMENT,
  TOOL_GET_DOCUMENT,
  TOOL_GET_DOCUMENT_BLOCKS,
  TOOL_GET_DOCUMENT_RAW,
  TOOL_SEARCH_DOCUMENTS,
  TOOL_UPDATE_DOCUMENT,
} from '@/consts/index.js';
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
    TOOL_GET_DOCUMENT_RAW,
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
    TOOL_GET_DOCUMENT,
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

  server.tool(
    TOOL_UPDATE_DOCUMENT,
    'Update a FeiShu document',
    {
      docId: z.string().describe('The document ID to update'),
      title: z.string().optional().describe('New title for the document'),
      folderToken: z
        .string()
        .optional()
        .describe('New folder token for the document'),
    },
    async (args, extra) => {
      const { docId, title, folderToken } = args;
      try {
        logger.info(`Updating document ${docId}`);
        const updatedDoc = await services.documents.updateDocument(docId, {
          title,
          folderToken,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: `Document updated successfully: ${updatedDoc.title}`,
            },
            {
              type: 'json' as const,
              json: updatedDoc,
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
          errorMessage = `Error updating document: ${error.message}`;
        } else {
          logger.error('Failed to update document:', error);
          errorMessage = `Error updating document: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    TOOL_DELETE_DOCUMENT,
    'Delete a FeiShu document',
    {
      docId: z.string().describe('The document ID to delete'),
    },
    async (args) => {
      const { docId } = args;
      try {
        logger.info(`Deleting document ${docId}`);
        const deleted = await services.documents.deleteDocument(docId);

        return {
          content: [
            {
              type: 'text' as const,
              text: deleted
                ? `Document ${docId} deleted successfully`
                : `Document ${docId} deletion request processed but status unclear`,
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
          errorMessage = `Error deleting document: ${error.message}`;
        } else {
          logger.error('Failed to delete document:', error);
          errorMessage = `Error deleting document: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  // Get document blocks
  server.tool(
    TOOL_GET_DOCUMENT_BLOCKS,
    'Get blocks from a FeiShu document',
    {
      docId: z.string().describe('The document ID to get blocks for'),
      pageSize: z
        .number()
        .optional()
        .describe('Number of blocks to return per page'),
      pageToken: z.string().optional().describe('Token for pagination'),
    },
    async (args, extra) => {
      const { docId, pageSize, pageToken } = args;
      try {
        logger.info(`Getting blocks for document ${docId}`);
        const blocksData = await services.documents.getDocumentBlocks(
          docId,
          pageSize,
          pageToken,
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: `Retrieved ${blocksData.blocks.length} blocks from document`,
            },
            {
              type: 'json' as const,
              json: blocksData,
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
          errorMessage = `Error getting document blocks: ${error.message}`;
        } else {
          logger.error('Failed to get document blocks:', error);
          errorMessage = `Error getting document blocks: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    TOOL_SEARCH_DOCUMENTS,
    'Search FeiShu documents by keyword',
    {
      query: z.string().describe('Search keywords to find documents'),
      type: z
        .enum(['doc', 'docx', 'sheet'])
        .optional()
        .describe('Type of documents to search for'),
      pageSize: z
        .number()
        .optional()
        .describe('Number of items per page, default is 20'),
      pageToken: z.string().optional().describe('Page token for pagination'),
    },
    async (args, extra) => {
      const { query, type, pageSize, pageToken } = args;
      try {
        logger.info(`Searching documents with query: ${query}`);
        const searchResults = await services.documents.searchDocuments(query, {
          type,
          pageSize,
          pageToken,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: `Found ${searchResults.documents.length} documents matching "${query}".`,
            },
            {
              type: 'json' as const,
              json: searchResults,
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
          errorMessage = `Error searching documents: ${error.message}`;
        } else {
          logger.error('Failed to search documents:', error);
          errorMessage = `Error searching documents: ${error instanceof Error ? error.message : String(error)}`;
        }

        return {
          content: [{ type: 'text' as const, text: errorMessage }],
          isError: true,
        };
      }
    },
  );
}

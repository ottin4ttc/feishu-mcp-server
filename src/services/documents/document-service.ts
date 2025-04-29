/**
 * Document Service
 *
 * Implements FeiShu Document API operations.
 */
import { DocumentClient } from '@/client/documents/document-client.js';
import type { ApiClientConfig } from '@/client/types.js';
import { FeiShuApiError } from '../error.js';
import type {
  DocumentBlockBO,
  DocumentBlockTypeBO,
  DocumentBlocksBO,
  DocumentContentBO,
  DocumentInfoBO,
  DocumentSearchBO,
  UpdateDocumentParamsBO,
} from './types/index.js';

/**
 * Document service for FeiShu
 */
export class DocumentService {
  private client: DocumentClient;

  /**
   * Create document service
   *
   * @param config - API client configuration
   */
  constructor(config: ApiClientConfig) {
    this.client = new DocumentClient(config);
  }

  /**
   * Get document raw content
   *
   * @param documentId - Document ID
   * @returns Document content as string
   * @throws FeiShuApiError if API request fails
   */
  async getDocumentContent(documentId: string): Promise<string> {
    try {
      const response = await this.client.getDocumentContent(documentId);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get document content: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.content) {
        throw new FeiShuApiError('Document returned empty content');
      }

      return response.data.content;
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error accessing document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get document metadata
   *
   * @param documentId - Document ID
   * @returns Document metadata
   * @throws FeiShuApiError if API request fails
   */
  async getDocumentInfo(documentId: string): Promise<DocumentInfoBO> {
    try {
      const response = await this.client.getDocumentInfo(documentId);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get document info: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.document) {
        throw new FeiShuApiError('Document info not found');
      }

      return {
        id: response.data.document.document_id || '',
        revisionId: response.data.document.revision_id || 0,
        title: response.data.document.title || '',
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error accessing document info: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Update document information
   *
   * @param documentId - ID of the document to update
   * @param params - Update parameters
   * @returns Updated document information
   * @throws FeiShuApiError if API request fails
   */
  async updateDocument(
    documentId: string,
    params: UpdateDocumentParamsBO,
  ): Promise<DocumentInfoBO> {
    try {
      const response = await this.client.updateDocument(documentId, {
        title: params.title,
        folder_token: params.folderToken,
      });

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to update document: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.document) {
        throw new FeiShuApiError('Updated document info not found');
      }

      return {
        id: response.data.document.document_id || '',
        revisionId: response.data.document.revision_id || 0,
        title: response.data.document.title || '',
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error updating document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Delete a document
   *
   * @param documentId - ID of the document to delete
   * @returns True if document was deleted successfully
   * @throws FeiShuApiError if API request fails
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const response = await this.client.deleteDocument(documentId);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to delete document: ${response.msg}`,
          response.code,
        );
      }

      return response.data?.deleted || false;
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error deleting document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get document blocks
   *
   * @param documentId - ID of the document to get blocks for
   * @param pageSize - Number of blocks to return per page
   * @param pageToken - Token for pagination
   * @returns Document blocks in business object format
   * @throws FeiShuApiError if API request fails
   */
  async getDocumentBlocks(
    documentId: string,
    pageSize?: number,
    pageToken?: string,
  ): Promise<DocumentBlocksBO> {
    try {
      const response = await this.client.getDocumentBlocks(documentId, {
        page_size: pageSize,
        page_token: pageToken,
      });

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get document blocks: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.items) {
        return {
          blocks: [],
          hasMore: false,
        };
      }

      const blocks: DocumentBlockBO[] = response.data.items.map((block) => {
        const blockBO: DocumentBlockBO = {
          blockId: block.block_id,
          parentId: block.parent_id,
          blockType: block.block_type as unknown as DocumentBlockTypeBO,
        };

        switch (block.block_type) {
          case 'page':
            if (block.page) {
              blockBO.content = block.page.title;
            }
            break;
          case 'text':
            if (block.text) {
              blockBO.content = block.text.content;
              blockBO.elements = block.text.elements?.map((element) => ({
                type: element.type,
                content: element.text_run?.content,
                style: element.text_run?.text_element_style
                  ? {
                      bold: element.text_run.text_element_style.bold,
                      italic: element.text_run.text_element_style.italic,
                      underline: element.text_run.text_element_style.underline,
                      strikeThrough:
                        element.text_run.text_element_style.strike_through,
                    }
                  : undefined,
              }));
            }
            break;
          case 'heading1':
          case 'heading2':
          case 'heading3':
          case 'bullet':
          case 'ordered':
          case 'quote': {
            const contentObj = block[block.block_type];
            if (contentObj) {
              blockBO.content = contentObj.content;
            }
            break;
          }
          case 'code':
            if (block.code) {
              blockBO.content = block.code.content;
              blockBO.language = block.code.language;
            }
            break;
          case 'image':
            if (block.image) {
              blockBO.imageToken = block.image.token;
              blockBO.imageWidth = block.image.width;
              blockBO.imageHeight = block.image.height;
            }
            break;
          case 'table':
            if (block.table) {
              blockBO.tableRows = block.table.rows;
              blockBO.tableColumns = block.table.columns;
            }
            break;
        }

        return blockBO;
      });

      return {
        blocks,
        pageToken: response.data.page_token,
        hasMore: response.data.has_more || false,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error getting document blocks: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Search documents by keyword
   *
   * @param query - Search keywords
   * @param options - Search options including pagination and document type
   * @returns Document search results in business object format
   * @throws FeiShuApiError if API request fails
   */
  async searchDocuments(
    query: string,
    options?: {
      type?: 'doc' | 'docx' | 'sheet';
      pageSize?: number;
      pageToken?: string;
    },
  ): Promise<DocumentSearchBO> {
    try {
      const response = await this.client.searchDocuments(query, {
        type: options?.type,
        pageSize: options?.pageSize,
        pageToken: options?.pageToken,
      });

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to search documents: ${response.msg}`,
          response.code,
        );
      }

      if (!response.data?.items) {
        return {
          documents: [],
          hasMore: false,
        };
      }

      return {
        documents: response.data.items.map((item) => ({
          documentId: item.document_id || '',
          title: item.title || '',
          url: item.url || '',
          createTime: item.create_time || 0,
          updateTime: item.update_time || 0,
          owner: item.owner || '',
          type: item.type || '',
        })),
        pageToken: response.data.page_token,
        hasMore: response.data.has_more,
      };
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error searching documents: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

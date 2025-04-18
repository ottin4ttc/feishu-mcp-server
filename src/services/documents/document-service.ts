/**
 * Document Service
 *
 * Implements FeiShu Document API operations.
 */
import { DocumentClient } from '@/client/documents/document-client.js';
import type { ApiClientConfig } from '@/client/types.js';
import { FeiShuApiError } from '../error.js';
import type {
  DocumentContentBO,
  DocumentInfoBO,
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
}

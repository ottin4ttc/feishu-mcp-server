/**
 * Document Service
 *
 * Implements FeiShu Document API operations.
 */
import { DocumentClient } from '@/client/documents/document-client.js';
import type { ApiClientConfig } from '@/client/types.js';
import { FeiShuApiError } from '../error.js';
import type { DocumentContentBO, DocumentInfoBO } from './types/index.js';

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

      return response.data.document;
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error accessing document info: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

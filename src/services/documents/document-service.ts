import type { ApiClientConfig } from '@/client/api-client.js';
/**
 * Document Service
 *
 * Business logic for FeiShu document operations.
 */
import { DocumentClient } from '@/client/documents/document-client.js';
import { FeiShuApiError } from '../error.js';

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
  async getDocumentInfo(documentId: string) {
    try {
      const response = await this.client.getDocumentInfo(documentId);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to get document info: ${response.msg}`,
          response.code,
        );
      }

      return response.data?.document;
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
   * Create a new document
   *
   * @param title - Document title
   * @param folderToken - Folder token
   * @returns Created document info
   * @throws FeiShuApiError if API request fails
   */
  async createDocument(title?: string, folderToken?: string) {
    try {
      const response = await this.client.createDocument(title, folderToken);

      if (response.code !== 0) {
        throw new FeiShuApiError(
          `Failed to create document: ${response.msg}`,
          response.code,
        );
      }

      return response.data?.document;
    } catch (error) {
      if (error instanceof FeiShuApiError) {
        throw error;
      }

      throw new FeiShuApiError(
        `Error creating document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

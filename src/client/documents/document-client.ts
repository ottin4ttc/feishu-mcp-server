/**
 * Document Client for FeiShu
 *
 * API client specialized for document operations
 */
import { ApiClient, type ApiResponse } from '@/client/api-client.js';

/**
 * Document content response
 */
export interface DocumentContent {
  content?: string;
}

/**
 * Document info response
 */
export interface DocumentInfo {
  document?: {
    document_id?: string;
    revision_id?: number;
    title?: string;
    display_setting?: {
      show_authors?: boolean;
      show_create_time?: boolean;
      show_pv?: boolean;
      show_uv?: boolean;
      show_like_count?: boolean;
      show_comment_count?: boolean;
      show_related_matters?: boolean;
    };
    cover?: {
      token: string;
      offset_ratio_x?: number;
      offset_ratio_y?: number;
    };
  };
}

/**
 * Document API client
 *
 * Specialized client for interacting with FeiShu document APIs
 */
export class DocumentClient extends ApiClient {
  /**
   * Get document raw content
   *
   * @param documentId - ID of the document
   * @param lang - Language setting (0 for default)
   * @returns Document content response
   */
  async getDocumentContent(
    documentId: string,
    lang = 0,
  ): Promise<ApiResponse<DocumentContent>> {
    try {
      return await this.request<DocumentContent>({
        url: `/open-apis/docx/v1/documents/${documentId}/raw_content`,
        method: 'GET',
        params: { lang },
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get document metadata
   *
   * @param documentId - ID of the document
   * @returns Document information response
   */
  async getDocumentInfo(
    documentId: string,
  ): Promise<ApiResponse<DocumentInfo>> {
    try {
      return await this.request<DocumentInfo>({
        url: `/open-apis/docx/v1/documents/${documentId}`,
        method: 'GET',
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Create a new document
   *
   * @param title - Document title (optional)
   * @param folderToken - Folder token for document location (optional)
   * @returns Created document info response
   */
  async createDocument(
    title?: string,
    folderToken?: string,
  ): Promise<ApiResponse<DocumentInfo>> {
    try {
      return await this.request<DocumentInfo>({
        url: '/open-apis/docx/v1/documents',
        method: 'POST',
        data: {
          title,
          folder_token: folderToken,
        },
        paramsSerializer: this.createParamsSerializer(),
      });
    } catch (error) {
      return this.handleRequestError(error);
    }
  }
}

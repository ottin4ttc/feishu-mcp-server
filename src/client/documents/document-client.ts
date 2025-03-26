/**
 * Document Client for FeiShu
 *
 * API client specialized for document operations
 */
import { ApiClient, type ApiResponse } from '@/client/api-client.js';
import { fillApiPath } from '@/utils/index.js';

/**
 * Document information structure
 */
export interface Document {
  title: string;
  document_id: string;
  owner_id: string;
  create_time: string;
  update_time: string;
}

/**
 * Document meta information
 */
export interface DocumentMeta {
  title: string;
  document_id: string;
  revision: number;
}

/**
 * Document content response
 */
export interface DocumentContent {
  content?: string;
}

/**
 * Document permission settings
 */
export interface DocumentPermission {
  document_id: string;
  permission_type: 'doc_edit' | 'doc_view' | 'doc_share';
  user_ids?: string[];
  open_ids?: string[];
  department_ids?: string[];
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
        url: fillApiPath('/open-apis/docx/v1/documents/:document_id', {
          document_id: documentId,
        }),
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

  /**
   * Get document information
   *
   * @param documentId - ID of the document
   * @returns Document information
   */
  async getDocument(documentId: string): Promise<Document> {
    try {
      const response = await this.request<Document>({
        method: 'GET',
        url: `/open-apis/doc/v2/docs/${documentId}`,
      });

      if (response.code !== 0 || !response.data) {
        throw new Error(`Failed to get document: ${response.msg}`);
      }

      return response.data;
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Get document meta information
   *
   * @param documentId - ID of the document
   * @returns Document meta information
   */
  async getDocumentMeta(documentId: string): Promise<DocumentMeta> {
    try {
      const response = await this.request<DocumentMeta>({
        method: 'GET',
        url: `/open-apis/doc/v2/docs/${documentId}/meta`,
      });

      if (response.code !== 0 || !response.data) {
        throw new Error(`Failed to get document meta: ${response.msg}`);
      }

      return response.data;
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Update document content
   *
   * @param documentId - ID of the document
   * @param content - New content for the document
   * @param revision - Current revision of the document
   * @returns Updated document content
   */
  async updateDocumentContent(
    documentId: string,
    content: string,
    revision: number,
  ): Promise<DocumentContent> {
    try {
      const response = await this.request<DocumentContent>({
        method: 'PUT',
        url: `/open-apis/doc/v2/docs/${documentId}/content`,
        data: {
          content,
          revision,
        },
      });

      if (response.code !== 0 || !response.data) {
        throw new Error(`Failed to update document content: ${response.msg}`);
      }

      return response.data;
    } catch (error) {
      return this.handleRequestError(error);
    }
  }

  /**
   * Set document permissions
   *
   * @param options - Permission options
   * @returns API response indicating success
   */
  async setDocumentPermission(
    options: DocumentPermission,
  ): Promise<ApiResponse> {
    try {
      const response = await this.request({
        method: 'POST',
        url: '/open-apis/doc/v2/permissions',
        data: options,
      });

      if (response.code !== 0) {
        throw new Error(`Failed to set document permission: ${response.msg}`);
      }

      return response;
    } catch (error) {
      return this.handleRequestError(error);
    }
  }
}

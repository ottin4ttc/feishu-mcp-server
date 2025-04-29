import { ApiClient } from '@/client/api-client.js';
import type { ApiResponse, PaginationOptions } from '@/client/types.js';
/**
 * Document Client for FeiShu
 *
 * API client specialized for document operations
 */
import type {
  DeleteDocumentResponse,
  DocumentContent,
  DocumentInfo,
  DocumentSearchResponse,
  GetDocumentBlocksParams,
  GetDocumentBlocksResponse,
  UpdateDocumentParams,
} from './types/index.js';

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
  getDocumentContent = (
    documentId: string,
    lang = 0,
  ): Promise<ApiResponse<DocumentContent>> =>
    this.get<DocumentContent>(
      `/open-apis/docx/v1/documents/${documentId}/raw_content`,
      { lang },
    );

  /**
   * Get document metadata
   *
   * @param documentId - ID of the document
   * @returns Document information response
   */
  getDocumentInfo = (documentId: string): Promise<ApiResponse<DocumentInfo>> =>
    this.get<DocumentInfo>(`/open-apis/docx/v1/documents/${documentId}`);

  /**
   * Create a new document
   *
   * @param options - Document creation options
   * @returns Created document info response
   */
  createDocument = (
    options: { title?: string; folderToken?: string } = {},
  ): Promise<ApiResponse<DocumentInfo>> =>
    this.post<DocumentInfo>('/open-apis/docx/v1/documents', {
      title: options.title,
      folder_token: options.folderToken,
    });

  /**
   * Update document information
   *
   * @param documentId - ID of the document to update
   * @param params - Update parameters
   * @returns Updated document info response
   */
  updateDocument = (
    documentId: string,
    params: UpdateDocumentParams,
  ): Promise<ApiResponse<DocumentInfo>> =>
    this.put<DocumentInfo>(`/open-apis/docx/v1/documents/${documentId}`, {
      title: params.title,
      folder_token: params.folder_token,
    });

  /**
   * Delete a document
   *
   * @param documentId - ID of the document to delete
   * @returns Delete response
   */
  deleteDocument = (
    documentId: string,
  ): Promise<ApiResponse<DeleteDocumentResponse>> =>
    this.delete<DeleteDocumentResponse>(
      `/open-apis/docx/v1/documents/${documentId}`,
    );

  /**
   * Get document blocks
   *
   * @param documentId - ID of the document to get blocks for
   * @param params - Optional parameters for pagination
   * @returns Document blocks response
   */
  getDocumentBlocks = (
    documentId: string,
    params?: GetDocumentBlocksParams,
  ): Promise<ApiResponse<GetDocumentBlocksResponse>> =>
    this.get<GetDocumentBlocksResponse>(
      `/open-apis/docx/v1/documents/${documentId}/blocks`,
      params as Record<string, unknown>,
    );

  /**
   * Search documents by keyword
   *
   * @param query - Search keywords
   * @param options - Search options including pagination and document type
   * @returns Document search results
   */
  searchDocuments = (
    query: string,
    options?: PaginationOptions & {
      type?: 'doc' | 'docx' | 'sheet';
    },
  ): Promise<ApiResponse<DocumentSearchResponse>> => {
    return this.get<DocumentSearchResponse>('/open-apis/search/v1/docs', {
      query,
      ...options,
    });
  };
}

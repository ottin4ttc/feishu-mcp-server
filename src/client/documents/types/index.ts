/**
 * Documents API Type Definitions
 */

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
  };
}

/**
 * Update document request parameters
 */
export interface UpdateDocumentParams {
  title?: string;
  folder_token?: string;
}

/**
 * Delete document response
 */
export interface DeleteDocumentResponse {
  deleted?: boolean;
}

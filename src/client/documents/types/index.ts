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

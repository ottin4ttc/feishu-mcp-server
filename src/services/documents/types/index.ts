/**
 * Documents Service BO Types
 */

/**
 * Document content in business object format
 */
export interface DocumentContentBO {
  content: string;
}

/**
 * Document info in business object format
 */
export interface DocumentInfoBO {
  id: string;
  revisionId: number;
  title: string;
}

/**
 * Update document parameters in business object format
 */
export interface UpdateDocumentParamsBO {
  title?: string;
  folderToken?: string;
}

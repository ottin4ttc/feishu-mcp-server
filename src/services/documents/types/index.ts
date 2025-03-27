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

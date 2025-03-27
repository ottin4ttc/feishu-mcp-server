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

export interface DocumentsListParams {
  folder_token?: string;
  page_size?: number;
  page_token?: string;
  search_key?: string;
}

export interface DocumentsListResponse {
  items: Array<{
    document_id: string;
    title: string;
    owner_id: string;
    create_time: number;
    latest_modify_user: string;
    latest_modify_time: number;
    url: string;
  }>;
  page_token?: string;
  has_more: boolean;
}

export interface DocumentResponse {
  document_id: string;
  title: string;
  owner_id: string;
  create_time: number;
  latest_modify_user: string;
  latest_modify_time: number;
  url: string;
}

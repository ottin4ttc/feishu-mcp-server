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

/**
 * Document block types
 */
export enum DocumentBlockType {
  Page = 'page',
  Text = 'text',
  Heading1 = 'heading1',
  Heading2 = 'heading2',
  Heading3 = 'heading3',
  Bullet = 'bullet',
  Ordered = 'ordered',
  Code = 'code',
  Quote = 'quote',
  Divider = 'divider',
  Image = 'image',
  Table = 'table',
}

/**
 * Document block
 */
export interface DocumentBlock {
  block_id: string;
  parent_id: string;
  block_type: DocumentBlockType;
  page?: {
    title: string;
  };
  text?: {
    content: string;
    elements?: Array<{
      type: string;
      text_run?: {
        content: string;
        text_element_style?: {
          bold?: boolean;
          italic?: boolean;
          underline?: boolean;
          strike_through?: boolean;
        };
      };
    }>;
  };
  heading1?: {
    content: string;
    elements?: Array<unknown>;
  };
  heading2?: {
    content: string;
    elements?: Array<unknown>;
  };
  heading3?: {
    content: string;
    elements?: Array<unknown>;
  };
  bullet?: {
    content: string;
    elements?: Array<unknown>;
  };
  ordered?: {
    content: string;
    elements?: Array<unknown>;
  };
  code?: {
    content: string;
    language?: string;
  };
  quote?: {
    content: string;
    elements?: Array<unknown>;
  };
  divider?: Record<string, never>;
  image?: {
    token: string;
    width: number;
    height: number;
  };
  table?: {
    rows: number;
    columns: number;
  };
}

/**
 * Get document blocks parameters
 */
export interface GetDocumentBlocksParams {
  page_size?: number;
  page_token?: string;
}

/**
 * Get document blocks response
 */
export interface GetDocumentBlocksResponse {
  items?: DocumentBlock[];
  page_token?: string;
  has_more?: boolean;
}

/**
 * Document search result item
 */
export interface DocumentSearchItem {
  document_id?: string;
  title?: string;
  url?: string;
  create_time?: number;
  update_time?: number;
  owner?: string;
  type?: string;
}

/**
 * Document search response
 */
export interface DocumentSearchResponse {
  items: DocumentSearchItem[];
  page_token?: string;
  has_more: boolean;
}

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

/**
 * Document block type enum
 */
export enum DocumentBlockTypeBO {
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
 * Document block in business object format
 */
export interface DocumentBlockBO {
  blockId: string;
  parentId: string;
  blockType: DocumentBlockTypeBO;
  content?: string;
  elements?: Array<{
    type: string;
    content?: string;
    style?: {
      bold?: boolean;
      italic?: boolean;
      underline?: boolean;
      strikeThrough?: boolean;
    };
  }>;
  language?: string;
  imageToken?: string;
  imageWidth?: number;
  imageHeight?: number;
  tableRows?: number;
  tableColumns?: number;
}

/**
 * Document blocks response in business object format
 */
export interface DocumentBlocksBO {
  blocks: DocumentBlockBO[];
  pageToken?: string;
  hasMore: boolean;
}

/**
 * Document search item in business object format
 */
export interface DocumentSearchItemBO {
  documentId: string;
  title: string;
  url: string;
  createTime: number;
  updateTime: number;
  owner: string;
  type: string;
}

/**
 * Document search response in business object format
 */
export interface DocumentSearchBO {
  documents: DocumentSearchItemBO[];
  pageToken?: string;
  hasMore: boolean;
}

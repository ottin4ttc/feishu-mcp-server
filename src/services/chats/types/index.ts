/**
 * Chat search options
 */
export interface ChatSearchOptionsBO {
  query?: string;
  pageToken?: string;
  pageSize?: number;
  userIdType?: 'open_id' | 'union_id' | 'user_id';
}

/**
 * Chat list options
 */
export interface ChatListOptionsBO {
  pageToken?: string;
  pageSize?: number;
  userIdType?: 'open_id' | 'union_id' | 'user_id';
}

/**
 * Chat result interface
 */
export interface ChatResultBO {
  chats: ChatInfoBO[];
  pageToken?: string;
  hasMore: boolean;
}

/**
 * Chats Service BO Types
 */

/**
 * Chat information in business object format
 */
export interface ChatInfoBO {
  id: string;
  avatar: string;
  name: string;
  description: string;
  ownerId: string;
  ownerIdType: string;
  isExternal: boolean;
  tenantKey: string;
  status?: string;
}

/**
 * Chat list in business object format
 */
export interface ChatListBO {
  chats: ChatInfoBO[];
  hasMore: boolean;
  pageToken: string;
}

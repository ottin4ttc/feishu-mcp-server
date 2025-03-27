/**
 * Chats API Type Definitions
 */

/**
 * Common parameter interface for chat API calls
 */
export interface ChatParams {
  pageToken?: string;
  pageSize?: number;
  userIdType?: 'open_id' | 'union_id' | 'user_id';
  [key: string]: unknown;
}

/**
 * Chat search parameters
 */
export interface ChatSearchParams extends ChatParams {
  query?: string;
}

/**
 * Chat list parameters
 */
export type ChatListParams = ChatParams;

/**
 * Chat information
 */
export interface ChatData {
  chat_id: string;
  avatar: string;
  name: string;
  description: string;
  owner_id: string;
  owner_id_type: string;
  external: boolean;
  tenant_key: string;
  chat_status?: string;
}

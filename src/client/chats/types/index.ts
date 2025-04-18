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

/**
 * Chat list response
 */
export interface ChatListResponse {
  items: Array<ChatData>;
  page_token?: string;
  has_more: boolean;
}

/**
 * Create chat request parameters
 */
export interface CreateChatParams {
  name: string;
  description?: string;
  user_ids?: string[];
  bot_ids?: string[];
  open_ids?: string[];
  only_owner_add?: boolean;
  share_allowed?: boolean;
  only_owner_at_all?: boolean;
  only_owner_edit?: boolean;
  join_message_visibility?: string;
  leave_message_visibility?: string;
  membership_approval?: string;
  external_ids?: string[];
  user_id_type?: string;
}

/**
 * Create chat response
 */
export interface CreateChatResponse {
  chat_id: string;
  invalid_user_ids?: string[];
  invalid_bot_ids?: string[];
  invalid_open_ids?: string[];
}

/**
 * Get chat info parameters
 */
export interface GetChatInfoParams {
  user_id_type?: string;
}

/**
 * Chat info response
 */
export interface ChatInfoResponse {
  chat_id: string;
  avatar: string;
  name: string;
  description: string;
  owner_id: string;
  owner_id_type: string;
  external: boolean;
  tenant_key: string;
  add_member_permission?: string;
  share_card_permission?: string;
  at_all_permission?: string;
  edit_permission?: string;
  membership_approval?: string;
  join_message_visibility?: string;
  leave_message_visibility?: string;
  type?: string;
  mode_type?: string;
  chat_tag?: string;
  bot_manager_ids?: string[];
  i18n_names?: Record<string, string>;
}

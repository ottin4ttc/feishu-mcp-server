/**
 * Bots API Type Definitions
 */

/**
 * Message types supported by bots
 */
export enum MessageType {
  TEXT = 'text',
  POST = 'post',
  IMAGE = 'image',
  INTERACTIVE = 'interactive',
  SHARE_CHAT = 'share_chat',
  SHARE_USER = 'share_user',
  AUDIO = 'audio',
  MEDIA = 'media',
  FILE = 'file',
  STICKER = 'sticker',
  LOCATION = 'location',
}

/**
 * Bot message response format
 */
export interface MessageResponse {
  message_id: string;
}

/**
 * Reply message request parameters
 */
export interface ReplyMessageParams {
  content: string | Record<string, unknown>;
  msg_type: MessageType;
}

/**
 * Edit message request parameters
 */
export interface EditMessageParams {
  content: string | Record<string, unknown>;
  msg_type: MessageType;
}

/**
 * Forward message request parameters
 */
export interface ForwardMessageParams {
  receive_id: string;
  receive_id_type?: string;
}

/**
 * Parameters for retrieving message list
 */
export interface MessagesListParams {
  chat_id?: string;
  page_size?: number;
  page_token?: string;
  container_id_type?: string;
  container_id?: string;
  start_time?: string;
  end_time?: string;
  sort_type?: 'ASC' | 'DESC';
  need_image_thumbnail?: boolean;
}

/**
 * Response data for message list
 */
export interface MessagesListResponse {
  items: Array<{
    message_id: string;
    root_id?: string;
    parent_id?: string;
    thread_id?: string;
    msg_type: string;
    create_time: string;
    update_time: string;
    deleted: boolean;
    updated: boolean;
    chat_id?: string;
    sender: {
      id: string;
      id_type: string;
      sender_type: string;
      tenant_key?: string;
    };
    body: {
      content: string;
    };
    mentions?: Array<{
      key: string;
      id: string;
      id_type: string;
      name: string;
      tenant_key?: string;
    }>;
  }>;
  page_token?: string;
  has_more: boolean;
}

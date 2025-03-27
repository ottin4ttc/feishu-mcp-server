/**
 * Bots Service BO Types
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
 * Message sender in business object format
 */
export interface MessageSenderBO {
  id: string;
  idType: string;
  senderType: string;
  tenantKey?: string;
}

/**
 * Message mention in business object format
 */
export interface MessageMentionBO {
  key: string;
  id: string;
  idType: string;
  name: string;
  tenantKey?: string;
}

/**
 * Message info in business object format
 */
export interface MessageInfoBO {
  id: string;
  rootId?: string;
  parentId?: string;
  threadId?: string;
  type: string;
  createTime: string;
  updateTime: string;
  isDeleted: boolean;
  isUpdated: boolean;
  chatId?: string;
  sender: MessageSenderBO;
  content: string;
  mentions?: MessageMentionBO[];
}

/**
 * Message list in business object format
 */
export interface MessageListBO {
  messages: MessageInfoBO[];
  hasMore: boolean;
  pageToken?: string;
}

/**
 * Bot message response structure
 */
export interface BotMessageResponseBO {
  messageId: string;
}

/**
 * Bot card content structure
 */
export interface BotCardContentBO {
  [key: string]: unknown;
}

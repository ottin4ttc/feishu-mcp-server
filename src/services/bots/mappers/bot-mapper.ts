import type { MessagesListResponse } from '@/client/bots/types/index.js';
import type {
  MessageInfoBO,
  MessageListBO,
  MessageMentionBO,
  MessageSenderBO,
} from '../types/index.js';

export class BotMapper {
  /**
   * Convert message sender from API response to BO
   */
  private toMessageSenderBO = (
    sender: MessagesListResponse['items'][0]['sender'],
  ): MessageSenderBO => ({
    id: sender.id,
    idType: sender.id_type,
    senderType: sender.sender_type,
    tenantKey: sender.tenant_key,
  });

  /**
   * Convert message mention from API response to BO
   */
  private toMessageMentionBO = (
    mention: NonNullable<MessagesListResponse['items'][0]['mentions']>[0],
  ): MessageMentionBO => ({
    key: mention.key,
    id: mention.id,
    idType: mention.id_type,
    name: mention.name,
    tenantKey: mention.tenant_key,
  });

  /**
   * Convert message info from API response to BO
   */
  toMessageInfoBO = (
    message: MessagesListResponse['items'][0],
  ): MessageInfoBO => ({
    id: message.message_id,
    rootId: message.root_id,
    parentId: message.parent_id,
    threadId: message.thread_id,
    type: message.msg_type,
    createTime: message.create_time,
    updateTime: message.update_time,
    isDeleted: message.deleted,
    isUpdated: message.updated,
    chatId: message.chat_id,
    sender: this.toMessageSenderBO(message.sender),
    content: message.body.content,
    mentions: message.mentions?.map(this.toMessageMentionBO),
  });

  /**
   * Convert message list from API response to BO
   */
  toMessageListBO = (data: MessagesListResponse): MessageListBO => ({
    messages: data.items.map(this.toMessageInfoBO),
    hasMore: data.has_more,
    pageToken: data.page_token,
  });
}

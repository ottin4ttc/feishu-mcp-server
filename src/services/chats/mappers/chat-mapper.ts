import type { Chat, ChatResponseData } from '@/client/chats/types/index.js';
import type { ChatInfoBO, ChatListBO } from '../types/index.js';

export class ChatMapper {
  /**
   * Convert chat info from API response to BO
   */
  toChatInfoBO = (data: Chat): ChatInfoBO => ({
    id: data.chat_id,
    avatar: data.avatar,
    name: data.name,
    description: data.description,
    ownerId: data.owner_id,
    ownerIdType: data.owner_id_type,
    isExternal: data.external,
    tenantKey: data.tenant_key,
    status: data.chat_status,
  });

  /**
   * Convert chat list from API response to BO
   */
  toChatListBO = (data: ChatResponseData): ChatListBO => ({
    chats: data.items.map(this.toChatInfoBO),
    hasMore: data.has_more,
    pageToken: data.page_token,
  });
}

/**
 * Tool registration
 *
 * Register all available tools for MCP.
 */

import type { ApiClientConfig } from '@/client/api-client.js';
import type { Tool } from '@modelcontextprotocol/sdk/share.js';

// Document tools
import { DocumentService } from '@/services/documents/document-service.js';
import {
  GET_DOCUMENT_RAW_TOOL_NAME,
  GetDocumentRawTool,
} from './impl/get-document-raw.js';
import {
  GET_DOCUMENT_TOOL_NAME,
  GetDocumentTool,
} from './impl/get-document.js';

// Bot tools
import { BotService } from '@/services/bots/bot-service.js';
import { SEND_CARD_TOOL_NAME, SendCardTool } from './impl/send-card.js';
import {
  SEND_TEXT_MESSAGE_TOOL_NAME,
  SendTextMessageTool,
} from './impl/send-text-message.js';

// Chat tools
import { ChatService } from '@/services/chats/chat-service.js';
import {
  SEARCH_CHATS_TOOL_NAME,
  SearchChatsTool,
} from './impl/search-chats.js';

/**
 * Register all available tools
 *
 * @param apiClientConfig API client configuration
 * @returns Map of tools with their names as keys
 */
export function registerTools(
  apiClientConfig: ApiClientConfig,
): Map<string, Tool<unknown>> {
  const tools = new Map<string, Tool<unknown>>();

  // Document tools
  const documentService = new DocumentService(apiClientConfig);
  tools.set(GET_DOCUMENT_TOOL_NAME, new GetDocumentTool(documentService));
  tools.set(
    GET_DOCUMENT_RAW_TOOL_NAME,
    new GetDocumentRawTool(documentService),
  );

  // Bot tools
  const botService = new BotService(apiClientConfig);
  tools.set(SEND_TEXT_MESSAGE_TOOL_NAME, new SendTextMessageTool(botService));
  tools.set(SEND_CARD_TOOL_NAME, new SendCardTool(botService));

  // Chat tools
  const chatService = new ChatService(apiClientConfig);
  tools.set(SEARCH_CHATS_TOOL_NAME, new SearchChatsTool(chatService));

  return tools;
}

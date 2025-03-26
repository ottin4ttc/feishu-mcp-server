import type { FeiShuServices } from '@/services/index.js';
import type { LoggerType } from '@/typings/index.js';
/**
 * MCP Tools Registry
 *
 * This module organizes and exports all available MCP tools.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerBotTools } from './bot-tools.js';
import { registerChatTools } from './chat-tools.js';
import { registerDocumentInfoTools } from './document-info-tools.js';
import { registerDocumentTools } from './document-tools.js';

/**
 * Tool registration parameters
 */
export interface ToolRegistryParams {
  server: McpServer;
  services: FeiShuServices;
  logger: LoggerType;
}

/**
 * Register all tools with the MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerAllTools(params: ToolRegistryParams): void {
  // Register document-related tools
  registerDocumentTools(params);

  // Register document info tools
  registerDocumentInfoTools(params);

  // Register bot-related tools
  registerBotTools(params);

  // Register chat-related tools
  registerChatTools(params);
}

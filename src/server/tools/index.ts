import type { FeiShuServices } from '@/services/index.js';
import type { Logger } from '@/typings/index.js';
/**
 * MCP Tools Registry
 *
 * This module organizes and exports all available MCP tools.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerBotTools } from './bot-tools.js';
import { registerChatTools } from './chat-tools.js';
import { registerDepartmentTools } from './department-tools.js';
import { registerDocumentTools } from './document-tools.js';
import { registerSheetTools } from './sheet-tools.js';
import { registerUserTools } from './user-tools.js';

/**
 * Tool registration parameters
 */
export interface ToolRegistryParams {
  server: McpServer;
  services: FeiShuServices;
  logger: Logger;
}

/**
 * Register all tools with the MCP server
 *
 * @param params - Tool registration parameters
 */
export function registerAllTools(params: ToolRegistryParams): void {
  // Register document-related tools
  registerDocumentTools(params);

  // Register bot-related tools
  registerBotTools(params);

  // Register chat-related tools
  registerChatTools(params);

  // Register sheet-related tools
  registerSheetTools(params);

  // Register user-related tools
  registerUserTools(params);

  // Register department-related tools
  registerDepartmentTools(params);
}

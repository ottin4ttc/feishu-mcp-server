#!/usr/bin/env node

/**
 * FeiShu MCP Server Entry Point
 *
 * This file serves as the main entry point for the entire service,
 * responsible for initializing and launching the MCP server.
 * Supports two operational modes: Standard I/O (stdio) and HTTP.
 */

import { getServerConfig } from '@/config.js';
import { FeiShuMcpServer } from '@/server/mcp-server.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

/**
 * Initialize and start the server
 *
 * Determines which mode to use based on environment variables or command-line arguments:
 * - stdio mode: Used in CLI environments, communicates via standard input/output
 * - HTTP mode: Launches a web server exposing API endpoints
 */
async function startServer() {
  // Determine if stdio mode should be used
  const isStdioMode =
    process.env.NODE_ENV === 'cli' || process.argv.includes('--stdio');
  // Retrieve server configuration
  const config = getServerConfig(isStdioMode);
  // Instantiate the server
  const server = new FeiShuMcpServer(config);

  if (isStdioMode) {
    // stdio mode: Communication via standard input/output
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    // HTTP mode: Launch web server
    console.log(
      `Initializing FeiShu MCP Server (HTTP mode) on port ${config.port}...`,
    );
    await server.startHttpServer(config.port);
  }
}

/**
 * Determine if this file is being executed directly
 *
 * Distinguishes between direct execution and being imported as a module
 * @returns {boolean} True if file is executed directly
 */
function isDirectRun() {
  return import.meta.url === `file://${process.argv[1]}`;
}

// Launch server if this file is executed directly
if (isDirectRun()) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

// Export document client
export * from './client/documents/document-client.js';

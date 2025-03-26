import { type ApiClientConfig, ApiEndpoint } from '@/client/api-client.js';
import { FeiShuServices } from '@/services/index.js';
import type { LogMessage, Logger, ServerConfig } from '@/typings/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
/**
 * MCP Server Implementation
 *
 * Core server implementation that handles connections and tool registration.
 */
import express from 'express';
import type { Request, Response } from 'express';
import { registerAllTools } from './tools/index.js';

/**
 * Global ServerLogger
 *
 * Default empty implementation that will be replaced with actual implementation
 * after connection is established.
 */
export const ServerLogger: Logger = {
  log: (...args: LogMessage[]) => {
    console.log(...args);
  },
  error: (...args: LogMessage[]) => {
    console.error(...args);
  },
  warn: (...args: LogMessage[]) => {
    console.warn(...args);
  },
  info: (...args: LogMessage[]) => {
    console.info(...args);
  },
  debug: (...args: LogMessage[]) => {
    console.debug(...args);
  },
  trace: (...args: LogMessage[]) => {
    console.trace(...args);
  },
};

/**
 * FeiShu MCP Server
 *
 * Manages FeiShu API interaction through the Model Context Protocol.
 */
export class FeiShuMcpServer {
  /** MCP server instance */
  private server: McpServer;
  /** FeiShu services */
  private services: FeiShuServices;
  /** SSE transport instance for HTTP mode */
  private sseTransport: SSEServerTransport | null = null;
  /** Server version */
  private readonly version = '0.0.1';

  /**
   * Create a new FeiShu MCP server
   *
   * @param config - Server configuration
   */
  constructor(config: ServerConfig) {
    // Initialize FeiShu services
    const apiConfig: ApiClientConfig = {
      appId: config.feishuAppId,
      appSecret: config.feishuAppSecret,
      endpoint: ApiEndpoint.FEISHU,
      logger: ServerLogger,
    };

    this.services = new FeiShuServices(apiConfig);

    // Initialize MCP server
    this.server = new McpServer(
      {
        name: 'FeiShu MCP Server',
        version: this.version,
      },
      {
        capabilities: {
          logging: {},
          tools: {},
        },
      },
    );

    // Register all tools
    this.registerTools();
  }

  /**
   * Register all MCP tools
   */
  private registerTools(): void {
    registerAllTools({
      server: this.server,
      services: this.services,
      logger: ServerLogger,
    });
  }

  /**
   * Configure server logging
   */
  private setupLogging(): void {
    ServerLogger.info = (...args: LogMessage[]) => {
      this.server.server.sendLoggingMessage({
        level: 'info',
        data: args,
      });
    };

    ServerLogger.error = (...args: LogMessage[]) => {
      this.server.server.sendLoggingMessage({
        level: 'error',
        data: args,
      });
    };

    if (ServerLogger.warn) {
      ServerLogger.warn = (...args: LogMessage[]) => {
        this.server.server.sendLoggingMessage({
          level: 'warning',
          data: args,
        });
      };
    }

    if (ServerLogger.debug) {
      ServerLogger.debug = (...args: LogMessage[]) => {
        this.server.server.sendLoggingMessage({
          level: 'debug',
          data: args,
        });
      };
    }
  }

  /**
   * Connect to a transport
   *
   * @param transport - Transport instance
   */
  async connect(transport: any): Promise<void> {
    await this.server.connect(transport);
    this.setupLogging();
    ServerLogger.info('Server connected and ready to process requests');
  }

  /**
   * Start HTTP server
   *
   * @param port - Server port
   */
  async startHttpServer(port: number): Promise<void> {
    const app = express();
    this.configureExpressServer(app);
    this.startServer(app, port);
  }

  /**
   * Configure Express server
   *
   * @param app - Express application
   */
  private configureExpressServer(app: express.Express): void {
    // SSE endpoint
    app.get('/sse', async (req: Request, res: Response) => {
      console.log('New SSE connection established');
      this.sseTransport = new SSEServerTransport('/messages', res);
      await this.server.connect(this.sseTransport);
    });

    // Message handling endpoint
    app.post('/messages', async (req: Request, res: Response) => {
      if (!this.sseTransport) {
        res.sendStatus(400);
        return;
      }
      await this.sseTransport.handlePostMessage(req, res);
    });

    // Use console logger in HTTP mode
    ServerLogger.info = console.log;
    ServerLogger.error = console.error;
    if (ServerLogger.warn) ServerLogger.warn = console.warn;
    if (ServerLogger.debug) ServerLogger.debug = console.debug;
  }

  /**
   * Start HTTP server
   *
   * @param app - Express application
   * @param port - Server port
   */
  private startServer(app: express.Express, port: number): void {
    app.listen(port, () => {
      ServerLogger.info(`HTTP server listening on port ${port}`);
      ServerLogger.info(
        `SSE endpoint available at http://localhost:${port}/sse`,
      );
      ServerLogger.info(
        `Message endpoint available at http://localhost:${port}/messages`,
      );
    });
  }
}

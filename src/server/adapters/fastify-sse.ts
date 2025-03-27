import type { IncomingMessage, ServerResponse } from 'node:http';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

/**
 * Fastify SSE Transport Adapter
 *
 * Used to adapt Fastify's request/response objects to SSEServerTransport
 */
export class FastifySSETransport extends SSEServerTransport {
  private reply: FastifyReply;

  constructor(messagesPath: string, reply: FastifyReply) {
    super(messagesPath, reply.raw);
    this.reply = reply;
  }

  /**
   * Initialize SSE connection
   */
  async initializeSSE(): Promise<void> {
    // Use Fastify's API to set response headers
    this.reply
      .header('Content-Type', 'text/event-stream')
      .header('Cache-Control', 'no-cache')
      .header('Connection', 'keep-alive')
      .header('X-Accel-Buffering', 'no')
      .raw.write('\n');
  }

  /**
   * Handle POST message
   *
   * Override parent class method to support Fastify's request/response objects
   */
  override async handlePostMessage(
    req: IncomingMessage,
    res: ServerResponse,
    parsedBody?: unknown,
  ): Promise<void> {
    await super.handlePostMessage(req, res, parsedBody);
  }

  /**
   * Handle Fastify's request/response objects
   */
  async handleFastifyRequest(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    await this.handlePostMessage(request.raw, reply.raw, await request.body);
  }

  /**
   * Send SSE message
   */
  sendMessage(message: string): void {
    if (!this.reply.raw.writableEnded) {
      this.reply.raw.write(`data: ${message}\n\n`);
    }
  }

  /**
   * Close SSE connection
   */
  override async close(): Promise<void> {
    if (!this.reply.raw.writableEnded) {
      this.reply.raw.end();
    }
  }
}

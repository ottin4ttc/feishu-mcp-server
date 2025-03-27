import type { Logger } from '@/typings/index.js';
import type { LogMessage } from '@/typings/index.js';
import winston from 'winston';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

/**
 * Convert any parameters to string
 */
function formatLogMessage(args: LogMessage[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return arg.stack || arg.message;
      return JSON.stringify(arg);
    })
    .join(' ');
}

/**
 * MCP Server Logger
 *
 * Logger system implemented with Winston, supporting:
 * - Console color output
 * - JSON format
 * - Timestamp
 * - Multi-level logging
 */
export const ServerLogger: Logger = {
  log: (...args: LogMessage[]) => {
    winstonLogger.info(formatLogMessage(args));
  },
  error: (...args: LogMessage[]) => {
    winstonLogger.error(formatLogMessage(args));
  },
  warn: (...args: LogMessage[]) => {
    winstonLogger.warn(formatLogMessage(args));
  },
  info: (...args: LogMessage[]) => {
    winstonLogger.info(formatLogMessage(args));
  },
  debug: (...args: LogMessage[]) => {
    winstonLogger.debug(formatLogMessage(args));
  },
  trace: (...args: LogMessage[]) => {
    winstonLogger.verbose(formatLogMessage(args));
  },
};

/**
 * Configure log level
 * @param level Log level
 */
export function setLogLevel(level: string): void {
  winstonLogger.level = level;
}

/**
 * Add custom log transport
 * @param transport Winston transport instance
 */
export function addLogTransport(transport: winston.transport): void {
  winstonLogger.add(transport);
}

export default ServerLogger;

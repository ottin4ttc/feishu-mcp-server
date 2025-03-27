export interface Cache {
  set: (
    key: string | symbol,
    value: unknown,
    expire?: number,
    options?: {
      namespace?: string;
    },
  ) => Promise<boolean>;
  get: (
    key: string | symbol,
    options?: {
      namespace?: string;
    },
  ) => Promise<unknown>;
}

/**
 * Logger message type
 */
export type LogMessage = unknown;

/**
 * Common logger interface with basic logging functionality
 */
export interface Logger {
  log: (...msg: LogMessage[]) => void | Promise<void>;
  error: (...msg: LogMessage[]) => void | Promise<void>;
  warn: (...msg: LogMessage[]) => void | Promise<void>;
  info: (...msg: LogMessage[]) => void | Promise<void>;
  debug: (...msg: LogMessage[]) => void | Promise<void>;
  trace: (...msg: LogMessage[]) => void | Promise<void>;
}

/**
 * Logger type definition
 */
export type LoggerType = Logger;

export enum Domain {
  FeiShu = 0,
}

export enum LoggerLevel {
  fatal = 0,
  error = 1,
  warn = 2,
  info = 3,
  debug = 4,
  trace = 5,
}

export interface ServerConfig {
  feishuAppId: string;
  feishuAppSecret: string;
  port: number;
  configSources: {
    feishuAppId: string;
    feishuAppSecret: string;
    port: string;
  };
}

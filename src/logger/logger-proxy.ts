import { LoggerLevel } from '@/typings/index.js';
import type { LogMessage, Logger } from '@/typings/index.js';

export class LoggerProxy {
  private logger: Logger;
  private level: LoggerLevel;

  constructor(logger: Logger, level: LoggerLevel) {
    this.logger = logger;
    this.level = level;
  }

  error(...msg: LogMessage[]) {
    if (this.level >= LoggerLevel.error) {
      this.logger.error(msg);
    }
  }

  warn(...msg: LogMessage[]) {
    if (this.level >= LoggerLevel.warn) {
      this.logger.warn(msg);
    }
  }

  info(...msg: LogMessage[]) {
    if (this.level >= LoggerLevel.info) {
      this.logger.info(msg);
    }
  }

  debug(...msg: LogMessage[]) {
    if (this.level >= LoggerLevel.debug) {
      this.logger.debug(msg);
    }
  }

  trace(...msg: LogMessage[]) {
    if (this.level >= LoggerLevel.trace) {
      this.logger.trace(msg);
    }
  }
}

/* eslint-disable no-console */
import type { LogMessage, Logger } from '@/typings/index.js';

export const defaultLogger: Logger = {
  log: (...msg: LogMessage[]) => {
    console.log(...msg);
  },
  error: (...msg: LogMessage[]) => {
    console.error(...msg);
  },
  warn: (...msg: LogMessage[]) => {
    console.warn(...msg);
  },
  info: (...msg: LogMessage[]) => {
    console.info(...msg);
  },
  debug: (...msg: LogMessage[]) => {
    console.debug(...msg);
  },
  trace: (...msg: LogMessage[]) => {
    console.trace(...msg);
  },
};

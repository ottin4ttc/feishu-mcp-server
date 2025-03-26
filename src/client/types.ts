import {
  CTenantKey,
  CWithHelpdeskAuthorization,
  CWithUserAccessToken,
} from '@/consts/index.js';
import type { HttpInstance } from '@/typings/http.js';
import type { Cache, Domain, Logger, LoggerLevel } from '@/typings/index.js';

export interface IRequestOptions {
  lark?: {
    [CTenantKey]?: string;
    [CWithHelpdeskAuthorization]?: boolean;
    [CWithUserAccessToken]?: string;
  };
  params?: Record<string, string>;
  data?: Record<string, string>;
  headers?: Record<string, string>;
  path?: Record<string, string>;
}

export interface IClientParams {
  appId: string;
  appSecret: string;
  domain?: Domain | string;
  loggerLevel?: LoggerLevel;
  logger?: Logger;
  cache?: Cache;
  disableTokenCache?: boolean;
  httpInstance?: HttpInstance;
}

export interface IPayload {
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  path?: Record<string, string>;
}

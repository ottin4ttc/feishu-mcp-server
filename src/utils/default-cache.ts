import type { Cache } from '@/typings/index.js';
import { get } from '@/utils/index.js';

export class DefaultCache implements Cache {
  values: Map<
    string | symbol,
    {
      value: any;
      expiredTime?: number;
    }
  >;

  constructor() {
    this.values = new Map();
  }

  // When there is a namespace, splice the namespace and key to form a new key
  private getCacheKey(key: string | symbol, namespace?: string) {
    if (namespace) {
      return `${namespace}/${key.toString()}`;
    }
    return key;
  }

  async get(
    key: string | symbol,
    options?: {
      namespace?: string;
    },
  ) {
    const cacheKey = this.getCacheKey(key, get(options, 'namespace'));
    const data = this.values.get(cacheKey);

    if (data) {
      const { value, expiredTime } = data;
      if (!expiredTime || expiredTime - new Date().getTime() > 0) {
        return value;
      }
    }

    return undefined;
  }

  async set(
    key: string | symbol,
    value: string,
    expiredTime?: number,
    options?: {
      namespace?: string;
    },
  ) {
    const cacheKey = this.getCacheKey(key, get(options, 'namespace'));
    this.values.set(cacheKey, {
      value,
      expiredTime,
    });
    return true;
  }
}

export const internalCache = new DefaultCache();

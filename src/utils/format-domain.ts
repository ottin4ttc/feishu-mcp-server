import { Domain } from '@/typings/index.js';

export const formatDomain = (domain: Domain | string): string => {
  switch (domain) {
    case Domain.FeiShu:
      return 'https://open.feishu.cn';
    case Domain.Lark:
      return 'https://open.larksuite.com';
    default:
      return domain;
  }
};

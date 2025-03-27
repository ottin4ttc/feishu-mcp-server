export const camel2Snake = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase();

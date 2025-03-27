/**
 * Mask sensitive API key for display
 *
 * Obfuscates an API key by replacing all but the last 4 characters with asterisks.
 * Preserves a consistent masked format for security while providing a way to
 * distinguish between different keys.
 *
 * @param key - The API key to mask
 * @returns Masked key with only the last 4 characters visible
 */
export function maskApiKey(key: string): string {
  if (key.length <= 4) return '****';
  return `****${key.slice(-4)}`;
}

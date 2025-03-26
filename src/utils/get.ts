/**
 * Gets a value from a nested object using a dot-notation path
 *
 * @param obj - The object to retrieve the value from
 * @param path - The path to the value (dot notation string or symbol)
 * @param fallback - Optional fallback value if path doesn't exist
 * @returns The value at the path or the fallback value
 */
export const get = <T, R = unknown>(
  obj: T,
  path: string | symbol,
  fallback?: R,
): R | undefined => {
  if (typeof path === 'string') {
    return (
      (path
        .split('.')
        .reduce<unknown>(
          (acc, key) =>
            acc != null ? (acc as Record<string, unknown>)[key] : undefined,
          obj,
        ) as R) ?? fallback
    );
  }
  return ((obj as Record<symbol, unknown>)?.[path] as R) ?? fallback;
};

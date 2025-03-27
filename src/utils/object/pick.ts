/**
 * Creates an object composed of the picked object properties
 *
 * @param obj - The source object
 * @param keys - An array of property names to pick
 * @returns A new object with just the picked properties
 */
export const pick = <
  T extends Record<string | symbol, unknown>,
  K extends keyof T,
>(
  obj?: T,
  keys: K[] = [],
): Pick<T, K> => {
  const result = {} as Pick<T, K>;

  if (!obj) {
    return result;
  }

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
};

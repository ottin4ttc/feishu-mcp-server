/**
 * Pick object properties that satisfy the predicate function
 *
 * @param object - Source object
 * @param predicate - Function to test each property
 * @returns New object with properties that passed the test
 */
export const pickBy = <T extends Record<string, unknown>>(
  object: T,
  predicate: (value: unknown, key: string) => boolean,
): Partial<T> => {
  return Object.keys(object).reduce<Partial<T>>(
    (result, key) => {
      const k = key as keyof T;
      if (predicate(object[k], key)) {
        result[k] = object[k];
      }
      return result;
    },
    {} as Partial<T>,
  );
};

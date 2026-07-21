/**
 * Compares two objects and returns an object containing the differences.
 *
 * @param {any} a The first object to compare.
 * @param {any} b The second object to compare.
 * @returns {Record<string, any>} An object containing changed fields with old and new values.
 */
export function diffObjects(a: any, b: any): Record<string, any> {
  const result: Record<string, any> = {};

  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  for (const key of keys) {
    if (typeof a[key] === 'object' && typeof b[key] === 'object') {
      const nested = diffObjects(a[key], b[key]);
      if (Object.keys(nested).length) result[key] = nested;
    } else if (a[key] !== b[key]) {
      result[key] = { old: a[key], new: b[key] };
    }
  }

  return result;
}

/**
 * Compares two objects and returns an object containing the differences.
 *
 * @deprecated Use `diffObjects` for clearer object utility imports.
 * @param {any} a The first object to compare.
 * @param {any} b The second object to compare.
 * @returns {Record<string, any>} An object containing changed fields with old and new values.
 */
export function diff(a: any, b: any): Record<string, any> {
  return diffObjects(a, b);
}

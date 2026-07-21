import { isPlainObject } from './is-plain-object';

/**
 * Checks recursively if two values differ.
 *
 * @param {unknown} a The first value.
 * @param {unknown} b The second value.
 * @returns {boolean} `true` if the values differ; `false` otherwise.
 */
export function hasObjectDifferences(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return false;

  if (typeof a !== typeof b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return true;
    return a.some((value, i) => hasObjectDifferences(value, b[i]));
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return true;

    return keysA.some((key) => !(key in b) || hasObjectDifferences(a[key], b[key]));
  }

  return true;
}

/**
 * Checks recursively if two values differ.
 *
 * @deprecated Use `hasObjectDifferences` for clearer object utility imports.
 * @param {unknown} a The first value.
 * @param {unknown} b The second value.
 * @returns {boolean} `true` if the values differ; `false` otherwise.
 */
export function hasDifferences(a: unknown, b: unknown): boolean {
  return hasObjectDifferences(a, b);
}

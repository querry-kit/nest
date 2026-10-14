import { parseObject } from './parse';

/**
 * Normalizes query values and merges dotted paths, ignoring prototype-related keys.
 * Later values replace conflicting scalar or object values at the same path.
 *
 * @param {any} obj The unparsed object.
 * @returns {any} The normalized object, or null for null input.
 */
export function parseObjectProperties(obj: any): any {
  if (obj === null) return null;

  const parsed: any = {};
  for (const key of Object.keys(obj)) {
    const parts = key.split('.');
    if (parts.some((part) => ['__proto__', 'constructor', 'prototype'].includes(part))) continue;

    let cursor = parsed;
    for (const part of parts.slice(0, -1)) {
      if (
        !Object.hasOwn(cursor, part) ||
        !cursor[part] ||
        typeof cursor[part] !== 'object' ||
        Array.isArray(cursor[part])
      ) {
        cursor[part] = {};
      }
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = parseObject(obj[key]);
  }

  return parsed;
}

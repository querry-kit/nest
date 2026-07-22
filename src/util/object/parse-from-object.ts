import { createObjectFromPath } from './create-from-path';
import { parseObject } from './parse';

/**
 * Parses an object from an unparsed object.
 *
 * @param {any} obj The unparsed object.
 * @returns {any} The parsed object.
 */
export function parseObjectProperties(obj: any): any {
  if (obj === null) return null;

  const parsed: any = {};
  for (const key of Object.keys(obj)) {
    if (key.includes('.')) {
      Object.assign(parsed, createObjectFromPath(key, parseObject(obj[key])));
    } else {
      parsed[key] = parseObject(obj[key]);
    }
  }

  return parsed;
}

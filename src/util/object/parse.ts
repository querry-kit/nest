import { isBoolean } from './is-boolean';
import { isNumber } from './is-number';
import { isObject } from './is-object';
import { parseBoolean } from './parse-boolean';
import { parseObjectProperties } from './parse-from-object';

/**
 * Parses query-like values into JavaScript primitives and nested objects.
 *
 * @param {any} obj The value to parse.
 * @returns {any} The parsed value.
 */
export function parseObject(obj: any): any {
  if (obj === 'null') {
    return null;
  }

  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        return parseObject(JSON.parse(trimmed));
      } catch {
        return obj;
      }
    }
  }

  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  } else if (isObject(obj)) {
    return parseObjectProperties(obj);
  } else if (isBoolean(obj)) {
    return parseBoolean(obj);
  } else if (isNumber(obj)) {
    return Number(obj);
  }

  if (typeof obj === 'undefined') {
    return undefined;
  }

  return String(obj);
}

import { parseObject } from '../object/index.js';

/**
 * Parses query-like values into normalized JavaScript values.
 *
 * Delegates object parsing rules to `../object/index.js`.
 *
 * @param value Raw query value.
 * @returns Parsed query value.
 */
export function parseQueryObject<T = unknown>(value: T): T {
  return parseObject(value) as T;
}

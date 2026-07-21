import { parseObject } from '../util/object/index.js';

/**
 * Parses query-like values into Prisma-friendly JavaScript values.
 *
 * Delegates the generic object parsing rules to `../util/object/index.js`
 * while keeping this package's public API focused on Prisma query use cases.
 *
 * @param value Raw query value.
 * @returns Parsed query value.
 */
export function parseQueryObject<T = unknown>(value: T): T {
  return parseObject(value) as T;
}

import * as objectUtils from '../util/object/index.js';

type DecimalLike = {
  toNumber(): number;
};

type DecimalObjectUtils = typeof objectUtils & {
  isDecimalLike?: (value: unknown) => value is DecimalLike;
  serializeDecimalValues?: <T = unknown>(value: T) => T;
};

const decimalObjectUtils = objectUtils as DecimalObjectUtils;

/**
 * Serializes Prisma Decimal-like values to numbers recursively.
 *
 * Delegates the generic Decimal-like object traversal to
 * `../util/object/index.js` while keeping this package's public API
 * focused on Prisma query results.
 *
 * @param value The value to serialize.
 * @returns The serialized value.
 */
export function serializeDecimalValues<T = unknown>(value: T): T {
  if (decimalObjectUtils.serializeDecimalValues) {
    return decimalObjectUtils.serializeDecimalValues(value);
  }

  return serializeDecimalValuesFallback(value);
}

/**
 * Checks whether a value behaves like Prisma Decimal.
 *
 * @param value The value to inspect.
 * @returns True when the value exposes a Decimal-like `toNumber` method.
 */
export function isDecimalLike(value: unknown): value is DecimalLike {
  if (decimalObjectUtils.isDecimalLike) {
    return decimalObjectUtils.isDecimalLike(value);
  }

  return isDecimalLikeFallback(value);
}

function serializeDecimalValuesFallback<T = unknown>(value: T): T {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  if (isDecimalLikeFallback(value)) {
    return value.toNumber() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDecimalValuesFallback(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, serializeDecimalValuesFallback(item)]),
  ) as T;
}

function isDecimalLikeFallback(value: unknown): value is DecimalLike {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof (value as { toNumber?: unknown }).toNumber === 'function' &&
    Object.prototype.toString.call(value) !== '[object Date]'
  );
}

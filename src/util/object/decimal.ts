/**
 * Object shape used by Prisma Decimal and compatible decimal implementations.
 */
export type DecimalLike = {
  toNumber(): number;
};

/**
 * Serializes Decimal-like values to numbers recursively.
 *
 * @param value The value to serialize.
 * @returns The serialized value.
 */
export function serializeDecimalValues<T = unknown>(value: T): T {
  if (value == null || typeof value !== 'object') {
    return value;
  }

  if (isDecimalLike(value)) {
    return value.toNumber() as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDecimalValues(item)) as T;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, serializeDecimalValues(item)]),
  ) as T;
}

/**
 * Checks whether a value behaves like a Decimal value.
 *
 * Date objects are deliberately excluded even when they expose numeric conversion
 * behavior through other APIs.
 *
 * @param value The value to inspect.
 * @returns True when the value exposes a Decimal-like `toNumber` method.
 */
export function isDecimalLike(value: unknown): value is DecimalLike {
  return (
    value != null &&
    typeof value === 'object' &&
    typeof (value as { toNumber?: unknown }).toNumber === 'function' &&
    Object.prototype.toString.call(value) !== '[object Date]'
  );
}

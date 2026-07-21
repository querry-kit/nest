/**
 * Checks if a value is a plain non-array object.
 *
 * @param {unknown} value The value to check.
 * @returns {boolean} `true` if the value is an object, not `null`, and not an array.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

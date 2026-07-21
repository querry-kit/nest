/**
 * Checks if the given value can be parsed to a boolean.
 *
 * @param {any} obj The value to check.
 * @returns {boolean} `true` for booleans and boolean strings; `false` otherwise.
 */
export function isBoolean(obj: any): boolean {
  return typeof obj === 'boolean' || obj === 'true' || obj === 'false' || obj === true || obj === false;
}

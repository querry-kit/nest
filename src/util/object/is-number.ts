/**
 * Checks if the given value is a number or can be converted to a number.
 *
 * @param {any} obj The value to check.
 * @returns {boolean} `true` if the value can be parsed to a number; `false` otherwise.
 */
export function isNumber(obj: any): boolean {
  if (typeof obj === 'number') return Number.isFinite(obj);
  return typeof obj === 'string' && obj.trim() !== '' && Number.isFinite(Number(obj));
}

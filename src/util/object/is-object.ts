/**
 * Checks if the given value has the JavaScript object runtime type.
 *
 * @param {any} obj The value to check.
 * @returns {boolean} `true` if `typeof obj === 'object'`; `false` otherwise.
 */
export function isObject(obj: any): boolean {
  return typeof obj === 'object';
}

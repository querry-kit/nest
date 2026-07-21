/**
 * Parses a value to a boolean.
 *
 * @param {any} value The value to parse.
 * @returns {boolean} `true` if value is truthy (`true`, `'true'`, `'on'`, `'yes'`); `false` otherwise.
 */
export function parseBoolean(value: any): boolean {
  switch (value) {
    case true:
    case 'true':
    case 'on':
    case 'yes':
      return true;
    default:
      return false;
  }
}

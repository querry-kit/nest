export { D as DecimalLike, d as diffObjects, h as hasObjectDifferences, i as isBoolean, a as isDecimalLike, b as isNumber, c as isObject, e as isPlainObject, p as parseBoolean, f as parseObject, g as parseObjectProperties, s as serializeDecimalValues } from './parse-from-object-CzpcXT3S.cjs';

/**
 * Returns an object according to the given dotted path.
 *
 * @param {string} path The path of the value.
 * @param {any} value The value.
 * @returns {any} An object with the value at the given path.
 */
declare function createObjectFromPath(path: string, value: any): any;

export { createObjectFromPath };

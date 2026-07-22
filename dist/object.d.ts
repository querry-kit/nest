/**
 * Returns an object according to the given dotted path.
 *
 * @param {string} path The path of the value.
 * @param {any} value The value.
 * @returns {any} An object with the value at the given path.
 */
declare function createObjectFromPath(path: string, value: any): any;
/**
 * Returns an object according to the given dotted path.
 *
 * @deprecated Use `createObjectFromPath` for clearer object utility imports.
 * @param {string} path The path of the value.
 * @param {any} value The value.
 * @returns {any} An object with the value at the given path.
 */
declare function createFromPath(path: string, value: any): any;

/**
 * Object shape used by Prisma Decimal and compatible decimal implementations.
 */
type DecimalLike = {
    toNumber(): number;
};
/**
 * Serializes Decimal-like values to numbers recursively.
 *
 * @param value The value to serialize.
 * @returns The serialized value.
 */
declare function serializeDecimalValues<T = unknown>(value: T): T;
/**
 * Checks whether a value behaves like a Decimal value.
 *
 * Date objects are deliberately excluded even when they expose numeric conversion
 * behavior through other APIs.
 *
 * @param value The value to inspect.
 * @returns True when the value exposes a Decimal-like `toNumber` method.
 */
declare function isDecimalLike(value: unknown): value is DecimalLike;

/**
 * Compares two objects and returns an object containing the differences.
 *
 * @param {any} a The first object to compare.
 * @param {any} b The second object to compare.
 * @returns {Record<string, any>} An object containing changed fields with old and new values.
 */
declare function diffObjects(a: any, b: any): Record<string, any>;
/**
 * Compares two objects and returns an object containing the differences.
 *
 * @deprecated Use `diffObjects` for clearer object utility imports.
 * @param {any} a The first object to compare.
 * @param {any} b The second object to compare.
 * @returns {Record<string, any>} An object containing changed fields with old and new values.
 */
declare function diff(a: any, b: any): Record<string, any>;

/**
 * Checks recursively if two values differ.
 *
 * @param {unknown} a The first value.
 * @param {unknown} b The second value.
 * @returns {boolean} `true` if the values differ; `false` otherwise.
 */
declare function hasObjectDifferences(a: unknown, b: unknown): boolean;
/**
 * Checks recursively if two values differ.
 *
 * @deprecated Use `hasObjectDifferences` for clearer object utility imports.
 * @param {unknown} a The first value.
 * @param {unknown} b The second value.
 * @returns {boolean} `true` if the values differ; `false` otherwise.
 */
declare function hasDifferences(a: unknown, b: unknown): boolean;

/**
 * Checks if the given value can be parsed to a boolean.
 *
 * @param {any} obj The value to check.
 * @returns {boolean} `true` for booleans and boolean strings; `false` otherwise.
 */
declare function isBoolean(obj: any): boolean;

/**
 * Checks if the given value is a number or can be converted to a number.
 *
 * @param {any} obj The value to check.
 * @returns {boolean} `true` if the value can be parsed to a number; `false` otherwise.
 */
declare function isNumber(obj: any): boolean;

/**
 * Checks if the given value has the JavaScript object runtime type.
 *
 * @param {any} obj The value to check.
 * @returns {boolean} `true` if `typeof obj === 'object'`; `false` otherwise.
 */
declare function isObject(obj: any): boolean;

/**
 * Checks if a value is a plain non-array object.
 *
 * @param {unknown} value The value to check.
 * @returns {boolean} `true` if the value is an object, not `null`, and not an array.
 */
declare function isPlainObject(value: unknown): value is Record<string, unknown>;

/**
 * Parses query-like values into JavaScript primitives and nested objects.
 *
 * @param {any} obj The value to parse.
 * @returns {any} The parsed value.
 */
declare function parseObject(obj: any): any;
/**
 * Parses query-like values into JavaScript primitives and nested objects.
 *
 * @deprecated Use `parseObject` for clearer object utility imports.
 * @param {any} obj The value to parse.
 * @returns {any} The parsed value.
 */
declare function parse(obj: any): any;

/**
 * Parses a value to a boolean.
 *
 * @param {any} value The value to parse.
 * @returns {boolean} `true` if value is truthy (`true`, `'true'`, `'on'`, `'yes'`); `false` otherwise.
 */
declare function parseBoolean(value: any): boolean;

/**
 * Parses an object from an unparsed object.
 *
 * @param {any} obj The unparsed object.
 * @returns {any} The parsed object.
 */
declare function parseObjectProperties(obj: any): any;
/**
 * Parses an object from an unparsed object.
 *
 * @deprecated Use `parseObjectProperties` for clearer object utility imports.
 * @param {any} obj The unparsed object.
 * @returns {any} The parsed object.
 */
declare function parseFromObject(obj: any): any;

export { type DecimalLike, createFromPath, createObjectFromPath, diff, diffObjects, hasDifferences, hasObjectDifferences, isBoolean, isDecimalLike, isNumber, isObject, isPlainObject, parse, parseBoolean, parseFromObject, parseObject, parseObjectProperties, serializeDecimalValues };

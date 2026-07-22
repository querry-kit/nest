"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/util/object/index.ts
var object_exports = {};
__export(object_exports, {
  createFromPath: () => createFromPath,
  createObjectFromPath: () => createObjectFromPath,
  diff: () => diff,
  diffObjects: () => diffObjects,
  hasDifferences: () => hasDifferences,
  hasObjectDifferences: () => hasObjectDifferences,
  isBoolean: () => isBoolean,
  isDecimalLike: () => isDecimalLike,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  parse: () => parse,
  parseBoolean: () => parseBoolean,
  parseFromObject: () => parseFromObject,
  parseObject: () => parseObject,
  parseObjectProperties: () => parseObjectProperties,
  serializeDecimalValues: () => serializeDecimalValues
});
module.exports = __toCommonJS(object_exports);

// src/util/object/create-from-path.ts
function createObjectFromPath(path, value) {
  if (path.includes(".")) {
    const [root] = path.split(".", 1);
    const subpath = path.substring(path.indexOf(".") + 1);
    return { [root]: createObjectFromPath(subpath, value) };
  }
  return { [path]: value };
}
function createFromPath(path, value) {
  return createObjectFromPath(path, value);
}

// src/util/object/decimal.ts
function serializeDecimalValues(value) {
  if (value == null || typeof value !== "object") {
    return value;
  }
  if (isDecimalLike(value)) {
    return value.toNumber();
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeDecimalValues(item));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, serializeDecimalValues(item)])
  );
}
function isDecimalLike(value) {
  return value != null && typeof value === "object" && typeof value.toNumber === "function" && Object.prototype.toString.call(value) !== "[object Date]";
}

// src/util/object/diff.ts
function diffObjects(a, b) {
  const result = {};
  const keys = /* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (typeof a[key] === "object" && typeof b[key] === "object") {
      const nested = diffObjects(a[key], b[key]);
      if (Object.keys(nested).length) result[key] = nested;
    } else if (a[key] !== b[key]) {
      result[key] = { old: a[key], new: b[key] };
    }
  }
  return result;
}
function diff(a, b) {
  return diffObjects(a, b);
}

// src/util/object/is-plain-object.ts
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// src/util/object/has-differences.ts
function hasObjectDifferences(a, b) {
  if (Object.is(a, b)) return false;
  if (typeof a !== typeof b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return true;
    return a.some((value, i) => hasObjectDifferences(value, b[i]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return true;
    return keysA.some((key) => !(key in b) || hasObjectDifferences(a[key], b[key]));
  }
  return true;
}
function hasDifferences(a, b) {
  return hasObjectDifferences(a, b);
}

// src/util/object/is-boolean.ts
function isBoolean(obj) {
  return typeof obj === "boolean" || obj === "true" || obj === "false" || obj === true || obj === false;
}

// src/util/object/is-number.ts
function isNumber(obj) {
  if (typeof obj === "number") return Number.isFinite(obj);
  return typeof obj === "string" && obj.trim() !== "" && Number.isFinite(Number(obj));
}

// src/util/object/is-object.ts
function isObject(obj) {
  return typeof obj === "object";
}

// src/util/object/parse-boolean.ts
function parseBoolean(value) {
  switch (value) {
    case true:
    case "true":
    case "on":
    case "yes":
      return true;
    default:
      return false;
  }
}

// src/util/object/parse-from-object.ts
function parseObjectProperties(obj) {
  if (obj === null) return null;
  const parsed = {};
  for (const key of Object.keys(obj)) {
    if (key.includes(".")) {
      Object.assign(parsed, createObjectFromPath(key, parseObject(obj[key])));
    } else {
      parsed[key] = parseObject(obj[key]);
    }
  }
  return parsed;
}
function parseFromObject(obj) {
  return parseObjectProperties(obj);
}

// src/util/object/parse.ts
function parseObject(obj) {
  if (obj === "null") {
    return null;
  }
  if (typeof obj === "string") {
    const trimmed = obj.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}") || trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        return parseObject(JSON.parse(trimmed));
      } catch {
        return obj;
      }
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(parseObject);
  } else if (isObject(obj)) {
    return parseObjectProperties(obj);
  } else if (isBoolean(obj)) {
    return parseBoolean(obj);
  } else if (isNumber(obj)) {
    return Number(obj);
  }
  if (typeof obj === "undefined") {
    return void 0;
  }
  return String(obj);
}
function parse(obj) {
  return parseObject(obj);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createFromPath,
  createObjectFromPath,
  diff,
  diffObjects,
  hasDifferences,
  hasObjectDifferences,
  isBoolean,
  isDecimalLike,
  isNumber,
  isObject,
  isPlainObject,
  parse,
  parseBoolean,
  parseFromObject,
  parseObject,
  parseObjectProperties,
  serializeDecimalValues
});
//# sourceMappingURL=object.cjs.map
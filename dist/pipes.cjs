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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/pipes/index.ts
var pipes_exports = {};
__export(pipes_exports, {
  EmptyStringToNullPipe: () => EmptyStringToNullPipe,
  QueryTransformPipe: () => QueryTransformPipe
});
module.exports = __toCommonJS(pipes_exports);

// src/pipes/empty-string-to-null.pipe.ts
var import_common = require("@nestjs/common");
var EmptyStringToNullPipe = class {
  /**
   * Transforms request body values by replacing blank string entries with null.
   * @param {unknown} value The incoming request value.
   * @param {ArgumentMetadata} metadata Metadata of the current argument.
   * @returns {unknown} The transformed body value or the unchanged value.
   */
  transform(value, metadata) {
    if (metadata.type !== "body") {
      return value;
    }
    return EmptyStringToNullPipe.mapEmptyStringToNull(value);
  }
  /**
   * Recursively maps empty strings in any nested structure to null.
   * @param {unknown} value The value to normalize.
   * @returns {unknown} The normalized value.
   */
  static mapEmptyStringToNull(value) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    }
    if (Array.isArray(value)) {
      return value.map((item) => EmptyStringToNullPipe.mapEmptyStringToNull(item));
    }
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          EmptyStringToNullPipe.mapEmptyStringToNull(item)
        ])
      );
    }
    return value;
  }
};
EmptyStringToNullPipe = __decorateClass([
  (0, import_common.Injectable)()
], EmptyStringToNullPipe);

// src/pipes/query-transform.pipe.ts
var import_common2 = require("@nestjs/common");

// src/util/object/create-from-path.ts
function createObjectFromPath(path, value) {
  if (path.includes(".")) {
    const [root] = path.split(".", 1);
    const subpath = path.substring(path.indexOf(".") + 1);
    return { [root]: createObjectFromPath(subpath, value) };
  }
  return { [path]: value };
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

// src/pipes/query-transform.pipe.ts
var QueryTransformPipe = class {
  /**
   * Transforms query values by parsing primitive string values and dotted keys.
   *
   * @param {unknown} value Incoming request value.
   * @param {ArgumentMetadata} metadata Nest argument metadata.
   * @returns {unknown} Transformed query object or unchanged value.
   */
  transform(value, metadata) {
    if (metadata.type === "query" && typeof value === "object") {
      return parseObject(value);
    }
    return value;
  }
};
(0, import_common2.Injectable)()(QueryTransformPipe);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmptyStringToNullPipe,
  QueryTransformPipe
});
//# sourceMappingURL=pipes.cjs.map
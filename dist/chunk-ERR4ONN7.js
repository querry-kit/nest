import {
  parseObject
} from "./chunk-5E262EQA.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/pipes/empty-string-to-null.pipe.ts
import { Injectable } from "@nestjs/common";
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
  Injectable()
], EmptyStringToNullPipe);

// src/pipes/query-transform.pipe.ts
import { Injectable as Injectable2 } from "@nestjs/common";
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
Injectable2()(QueryTransformPipe);

export {
  EmptyStringToNullPipe,
  QueryTransformPipe
};
//# sourceMappingURL=chunk-ERR4ONN7.js.map
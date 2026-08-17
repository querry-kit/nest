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

// src/query-service/index.ts
var query_service_exports = {};
__export(query_service_exports, {
  QueryService: () => QueryService
});
module.exports = __toCommonJS(query_service_exports);

// src/query-service/query.service.ts
var import_common2 = require("@nestjs/common");

// src/pagination/page-meta.dto.ts
var import_swagger = require("@nestjs/swagger");
var import_class_transformer = require("class-transformer");
var PageMetaDTO = class {
  page;
  perPage;
  itemCount;
  pageCount;
  hasPrevPage;
  hasNextPage;
  /**
   * Creates pagination metadata.
   *
   * @param params Pagination options and item count.
   */
  constructor({ pageOptions, itemCount }) {
    this.page = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
};
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Current page number." })
], PageMetaDTO.prototype, "page", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Number of items per page." })
], PageMetaDTO.prototype, "perPage", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Total number of items." })
], PageMetaDTO.prototype, "itemCount", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Total number of pages." })
], PageMetaDTO.prototype, "pageCount", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Boolean, description: "Indicates whether a previous page exists." })
], PageMetaDTO.prototype, "hasPrevPage", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Boolean, description: "Indicates whether a next page exists." })
], PageMetaDTO.prototype, "hasNextPage", 2);

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

// src/util/query/parse-query-object.ts
function parseQueryObject(value) {
  return parseObject(value);
}

// src/query-service/errors/handle-query-service-error.ts
var import_common = require("@nestjs/common");

// src/query-service/errors/is-known-request-error-like.ts
function isKnownRequestErrorLike(error) {
  return error instanceof Error && typeof error.code === "string";
}

// src/query-service/errors/is-validation-error-like.ts
function isValidationErrorLike(error) {
  return error instanceof Error && error.name === "PrismaClientValidationError";
}

// src/query-service/errors/handle-query-service-error.ts
function handleQueryServiceError(error, options, args, errorLogger) {
  if (isValidationErrorLike(error)) {
    throw new import_common.BadRequestException({ message: "Invalid query.", options, parsedArgs: args });
  }
  if (isKnownRequestErrorLike(error)) {
    throw new import_common.BadRequestException({
      message: error.message.split("\n\n\n")[1] ?? "Invalid data",
      code: error.code,
      data: error.meta
    });
  }
  if (error instanceof import_common.HttpException) {
    throw error;
  }
  errorLogger?.error(error);
  throw new import_common.InternalServerErrorException();
}

// src/query-service/errors/is-forbidden-like.ts
function isForbiddenLike(error) {
  return error instanceof Error && (error.name === "ForbiddenError" || error.name === "ForbiddenErrorType");
}

// src/query-service/query.service.ts
var QueryService = class {
  /**
   * Creates a query service.
   *
   * @param table Prisma-compatible delegate.
   * @param serviceOptions Query service options.
   */
  constructor(table, serviceOptions = {}) {
    this.table = table;
    this.serviceOptions = serviceOptions;
  }
  table;
  serviceOptions;
  /**
   * Finds the first item matching query options.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item or null.
   */
  async findOne(options, ability) {
    const args = {
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
      where: this.mergeAbilityWhere(options.where, ability),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
      distinct: parseQueryObject(options.distinct)
    };
    try {
      return await this.table.findFirst(args);
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Finds all items matching query options.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found items.
   */
  async findMany(options = {}, ability) {
    const args = {
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
      where: this.mergeAbilityWhere(options.where, ability),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
      take: options.take,
      skip: options.skip,
      distinct: parseQueryObject(options.distinct)
    };
    try {
      return await this.table.findMany(args);
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Finds an item by ID.
   *
   * @param id Item ID.
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item.
   * @throws NotFoundException when no item exists.
   */
  async findById(id, options = {}, ability) {
    const args = {
      where: this.mergeAbilityWhere({ id }, ability),
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include)
    };
    try {
      const item = await this.table.findFirst(args);
      if (!item) {
        throw new import_common2.NotFoundException("Item not found.");
      }
      return item;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Finds an item by a unique where input.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item.
   * @throws NotFoundException when no item exists.
   */
  async findUnique(options, ability) {
    const args = {
      where: parseQueryObject(options.where),
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include)
    };
    try {
      const item = ability ? await this.table.findFirst({
        ...args,
        where: this.mergeAbilityWhere(options.where, ability)
      }) : await this.table.findUnique(args);
      if (!item) {
        throw new import_common2.NotFoundException("Item not found.");
      }
      return item;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }
  /**
   * Runs an aggregate query.
   *
   * @param options Aggregate options.
   * @returns Serialized aggregate result.
   */
  async aggregate(options) {
    const args = {
      ...options,
      where: parseQueryObject(options.where),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor)
    };
    const cleanedArgs = Object.fromEntries(
      Object.entries(args).filter(([, value]) => value !== void 0)
    );
    return serializeDecimalValues(await this.table.aggregate(cleanedArgs));
  }
  /**
   * Counts items matching query options.
   *
   * @param options Count options.
   * @param ability Optional access-control ability.
   * @returns Item count.
   */
  async count(options, ability) {
    const args = {
      where: this.mergeAbilityWhere(options.where, ability)
    };
    return await this.table.count(args);
  }
  /**
   * Runs a paginated query.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Paginated result.
   */
  async query(options, ability) {
    try {
      const page = options.page ?? 1;
      const perPage = options.perPage ?? 10;
      const skip = (page - 1) * perPage;
      const where = this.mergeAbilityWhere(options.where, ability);
      const itemCount = await this.count({ where });
      const items = await this.findMany({ ...options, take: perPage, skip, where });
      const pageMeta = new PageMetaDTO({ itemCount, pageOptions: { page, perPage } });
      return { pageMeta, items };
    } catch (error) {
      if (isForbiddenLike(error)) {
        throw new import_common2.ForbiddenException("Insufficient permissions.");
      }
      throw error;
    }
  }
  /**
   * Combines a where input with an access-control where input when available.
   *
   * @param where Query where object.
   * @param ability Optional access-control ability.
   * @returns Merged where object.
   */
  mergeAbilityWhere(where, ability) {
    const parsedWhere = parseQueryObject(where ?? {});
    if (!ability || !this.serviceOptions.accessibleWhere || this.serviceOptions.subject === void 0) {
      return parsedWhere;
    }
    return {
      AND: [this.serviceOptions.accessibleWhere(ability, this.serviceOptions.subject), parsedWhere]
    };
  }
  /**
   * Converts Prisma-like errors to Nest HTTP exceptions.
   *
   * @param error Error thrown by a delegate.
   * @param options Original options.
   * @param args Parsed delegate args.
   * @throws Converted Nest HTTP exception.
   */
  handleError(error, options, args) {
    handleQueryServiceError(error, options, args, this.serviceOptions.errorLogger);
  }
};
QueryService = __decorateClass([
  (0, import_common2.Injectable)()
], QueryService);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  QueryService
});
//# sourceMappingURL=query-service.cjs.map
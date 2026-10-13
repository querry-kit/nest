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

// src/decorators/index.ts
var decorators_exports = {};
__export(decorators_exports, {
  ApiErrorResponses: () => ApiErrorResponses,
  ApiPaginatedResponse: () => ApiPaginatedResponse,
  ApiParamId: () => ApiParamId,
  ApiPropertyCreatedAt: () => ApiPropertyCreatedAt,
  ApiPropertyId: () => ApiPropertyId,
  ApiPropertyUpdatedAt: () => ApiPropertyUpdatedAt,
  ApiResourceQuery: () => ApiResourceQuery
});
module.exports = __toCommonJS(decorators_exports);

// src/decorators/params/api-param-id.decorator.ts
var import_common = require("@nestjs/common");
var import_swagger = require("@nestjs/swagger");
function ApiParamId(options = {}) {
  return (0, import_common.applyDecorators)(
    (0, import_swagger.ApiParam)({
      name: options.name ?? "id",
      description: options.description,
      type: "string",
      format: "uuid"
    })
  );
}

// src/decorators/properties/api-property-created-at.decorator.ts
var import_common2 = require("@nestjs/common");
var import_swagger2 = require("@nestjs/swagger");
function ApiPropertyCreatedAt(options = {}) {
  return (0, import_common2.applyDecorators)(
    (0, import_swagger2.ApiProperty)({
      description: options.description ?? "The creation date of the item.",
      ...options
    })
  );
}

// src/decorators/properties/api-property-id.decorator.ts
var import_common3 = require("@nestjs/common");
var import_swagger3 = require("@nestjs/swagger");
function ApiPropertyId(options = {}) {
  return (0, import_common3.applyDecorators)(
    (0, import_swagger3.ApiProperty)({
      example: options.example ?? crypto.randomUUID(),
      description: options.description ?? "The ID of the item.",
      ...options
    })
  );
}

// src/decorators/properties/api-property-updated-at.decorator.ts
var import_common4 = require("@nestjs/common");
var import_swagger4 = require("@nestjs/swagger");
function ApiPropertyUpdatedAt(options = {}) {
  return (0, import_common4.applyDecorators)(
    (0, import_swagger4.ApiProperty)({
      description: options.description ?? "The updated date of the item.",
      ...options
    })
  );
}

// src/decorators/query/api-resource-query.decorator.ts
var import_common5 = require("@nestjs/common");
var import_swagger5 = require("@nestjs/swagger");
var queryObjectSchema = {
  oneOf: [{ type: "object" }, { type: "string" }]
};
var invalidResourceQueryDescription = "Invalid fields syntax, unknown fields, invalid include/select, or invalid query values.";
var invalidResourceQueryResponse = {
  description: invalidResourceQueryDescription,
  schema: {
    type: "object",
    properties: {
      statusCode: { type: "number", default: import_common5.HttpStatus.BAD_REQUEST },
      error: { type: "string", default: "Bad Request" },
      message: { type: "string" }
    }
  },
  examples: {
    invalidResourceQuery: {
      summary: "Invalid resource query",
      value: {
        statusCode: import_common5.HttpStatus.BAD_REQUEST,
        error: "Bad Request",
        message: invalidResourceQueryDescription
      }
    }
  }
};
function ApiResourceQuery(options = {}) {
  const decorators = [
    (0, import_swagger5.ApiQuery)({
      name: "fields",
      required: false,
      type: String,
      description: "Response field projection. Use `id,title` for item fields or `items{id,title},meta{page,perPage}` for paginated envelopes.",
      example: "items{id,title,author{name}},meta{page,perPage,itemCount,pageCount}"
    }),
    (0, import_swagger5.ApiQuery)({
      name: "select",
      required: false,
      schema: queryObjectSchema,
      description: "Prisma select object. Invalid select values are reported as HTTP 400 by the service layer."
    }),
    (0, import_swagger5.ApiQuery)({
      name: "include",
      required: false,
      schema: queryObjectSchema,
      description: "Prisma include object. Client includes are merged with endpoint-required includes and fields-generated relation includes."
    }),
    (0, import_swagger5.ApiQuery)({
      name: "where",
      required: false,
      schema: queryObjectSchema,
      description: "Prisma where object. Dotted query keys are expanded and primitive values are parsed."
    }),
    (0, import_swagger5.ApiQuery)({
      name: "orderBy",
      required: false,
      schema: { oneOf: [{ type: "object" }, { type: "array" }, { type: "string" }] },
      description: "Prisma orderBy object or array."
    }),
    (0, import_swagger5.ApiQuery)({
      name: "distinct",
      required: false,
      schema: { oneOf: [{ type: "string" }, { type: "array" }] },
      description: "Prisma distinct field or fields."
    }),
    (0, import_swagger5.ApiBadRequestResponse)(invalidResourceQueryResponse)
  ];
  if (options.pagination ?? true) {
    decorators.unshift(
      (0, import_swagger5.ApiQuery)({
        name: "page",
        required: false,
        type: Number,
        description: "Current page number.",
        example: 1
      }),
      (0, import_swagger5.ApiQuery)({
        name: "perPage",
        required: false,
        type: Number,
        description: "Number of items per page.",
        example: 10
      })
    );
  }
  return (0, import_common5.applyDecorators)(...decorators);
}

// src/decorators/responses/api-error-responses.decorator.ts
var import_common8 = require("@nestjs/common");

// src/decorators/responses/error-responses/get-message-from-status-code.ts
var import_common6 = require("@nestjs/common");
function getMessageFromStatusCode(statusCode) {
  switch (statusCode) {
    case import_common6.HttpStatus.BAD_REQUEST:
      return "Bad Request";
    case import_common6.HttpStatus.UNAUTHORIZED:
      return "Unauthorized";
    case import_common6.HttpStatus.FORBIDDEN:
      return "Forbidden";
    case import_common6.HttpStatus.NOT_FOUND:
      return "Not Found";
    case import_common6.HttpStatus.CONFLICT:
      return "Conflict";
    case import_common6.HttpStatus.TOO_MANY_REQUESTS:
      return "Too Many Requests";
    case import_common6.HttpStatus.INTERNAL_SERVER_ERROR:
      return "Internal Server Error";
    default:
      return "Error";
  }
}

// src/decorators/responses/error-responses/get-example-from-code.ts
function getExampleFromCode(statusCode, code) {
  const message = Array.isArray(code) ? code[0] : code;
  const error = Array.isArray(code) ? code[1] : getMessageFromStatusCode(statusCode);
  return {
    summary: error,
    value: { statusCode, message, error }
  };
}

// src/decorators/responses/error-responses/get-examples.ts
function getExamples(statusCode, codes) {
  if (codes.length === 0) return void 0;
  return codes.reduce((acc, code, index) => {
    const codeName = Array.isArray(code) ? code[0] : code;
    const key = acc[codeName] ? `${codeName}-${index}` : codeName;
    acc[key] = getExampleFromCode(statusCode, code);
    return acc;
  }, {});
}

// src/decorators/responses/error-responses/get-single-example.ts
function getSingleExample(statusCode, codes, description, message) {
  if (codes.length > 0) return void 0;
  if (!description) return void 0;
  return {
    summary: description,
    value: {
      statusCode,
      message: description,
      error: message
    }
  };
}

// src/decorators/responses/error-responses/get-response-decorator-options.ts
function getResponseDecoratorOptions(statusCode, codes, description) {
  if (!codes && !description) return void 0;
  const normalizedCodes = codes ?? [];
  const message = getMessageFromStatusCode(statusCode);
  return {
    description: description ?? message,
    schema: {
      description: description ?? message,
      type: "object",
      properties: {
        statusCode: { type: "number", default: statusCode },
        error: { type: "string", default: message },
        message: { type: "string" }
      }
    },
    example: getSingleExample(statusCode, normalizedCodes, description, message),
    examples: getExamples(statusCode, normalizedCodes)
  };
}

// src/decorators/responses/error-responses/get-status-configs.ts
var import_common7 = require("@nestjs/common");
var import_swagger6 = require("@nestjs/swagger");
function getStatusConfigs(options) {
  return [
    {
      status: import_common7.HttpStatus.BAD_REQUEST,
      codes: options.badRequestCodes,
      description: options.badRequestDescription,
      decorator: import_swagger6.ApiBadRequestResponse
    },
    {
      status: import_common7.HttpStatus.UNAUTHORIZED,
      codes: options.unauthorizedCodes,
      description: options.unauthorizedDescription,
      decorator: import_swagger6.ApiUnauthorizedResponse
    },
    {
      status: import_common7.HttpStatus.FORBIDDEN,
      codes: options.forbiddenCodes,
      description: options.forbiddenDescription,
      decorator: import_swagger6.ApiForbiddenResponse
    },
    {
      status: import_common7.HttpStatus.NOT_FOUND,
      codes: options.notFoundCodes,
      description: options.notFoundDescription,
      decorator: import_swagger6.ApiNotFoundResponse
    },
    {
      status: import_common7.HttpStatus.CONFLICT,
      codes: options.conflictCodes,
      description: options.conflictDescription,
      decorator: import_swagger6.ApiConflictResponse
    },
    {
      status: import_common7.HttpStatus.TOO_MANY_REQUESTS,
      codes: options.tooManyRequestsCodes,
      description: options.tooManyRequestsDescription,
      decorator: import_swagger6.ApiTooManyRequestsResponse
    },
    {
      status: import_common7.HttpStatus.INTERNAL_SERVER_ERROR,
      codes: options.internalServerErrorCodes,
      description: options.internalServerErrorDescription ?? (options.internalServerError ? getMessageFromStatusCode(import_common7.HttpStatus.INTERNAL_SERVER_ERROR) : void 0),
      decorator: import_swagger6.ApiInternalServerErrorResponse
    }
  ];
}

// src/decorators/responses/api-error-responses.decorator.ts
function ApiErrorResponses(options = {}) {
  const decorators = getStatusConfigs(options).filter((config) => config.codes || config.description).map((config) => config.decorator(getResponseDecoratorOptions(config.status, config.codes, config.description)));
  return (0, import_common8.applyDecorators)(...decorators);
}

// src/decorators/responses/api-paginated-response.decorator.ts
var import_common9 = require("@nestjs/common");
var import_swagger9 = require("@nestjs/swagger");

// src/pagination/page-meta.dto.ts
var import_swagger7 = require("@nestjs/swagger");
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
  (0, import_swagger7.ApiProperty)({ type: Number, description: "Current page number." })
], PageMetaDTO.prototype, "page", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger7.ApiProperty)({ type: Number, description: "Number of items per page." })
], PageMetaDTO.prototype, "perPage", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger7.ApiProperty)({ type: Number, description: "Total number of items." })
], PageMetaDTO.prototype, "itemCount", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger7.ApiProperty)({ type: Number, description: "Total number of pages." })
], PageMetaDTO.prototype, "pageCount", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger7.ApiProperty)({ type: Boolean, description: "Indicates whether a previous page exists." })
], PageMetaDTO.prototype, "hasPrevPage", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger7.ApiProperty)({ type: Boolean, description: "Indicates whether a next page exists." })
], PageMetaDTO.prototype, "hasNextPage", 2);

// src/pagination/paginated.dto.ts
var import_swagger8 = require("@nestjs/swagger");
var import_class_transformer2 = require("class-transformer");
var import_class_validator = require("class-validator");
var PaginatedDTO = class {
  items;
  meta;
  /**
   * Creates a paginated DTO.
   *
   * @param items Items on the current page.
   * @param meta Pagination metadata.
   */
  constructor(items, meta) {
    this.items = items;
    this.meta = meta;
  }
};
__decorateClass([
  (0, import_class_transformer2.Expose)(),
  (0, import_swagger8.ApiProperty)({ type: () => [Object], description: "Items on the current page." }),
  (0, import_class_validator.IsArray)()
], PaginatedDTO.prototype, "items", 2);
__decorateClass([
  (0, import_class_transformer2.Expose)(),
  (0, import_swagger8.ApiProperty)({ type: () => PageMetaDTO, description: "Pagination metadata." }),
  (0, import_class_transformer2.Type)(() => PageMetaDTO),
  (0, import_class_validator.ValidateNested)()
], PaginatedDTO.prototype, "meta", 2);

// src/decorators/responses/api-paginated-response.decorator.ts
function ApiPaginatedResponse(options) {
  return (0, import_common9.applyDecorators)(
    (0, import_swagger9.ApiExtraModels)(PaginatedDTO, PageMetaDTO, options.model),
    (0, import_swagger9.ApiOkResponse)({
      ...options,
      description: options.description ?? "Paginated items",
      schema: {
        allOf: [
          { $ref: (0, import_swagger9.getSchemaPath)(PaginatedDTO) },
          {
            properties: {
              items: {
                type: "array",
                items: { $ref: (0, import_swagger9.getSchemaPath)(options.model) }
              },
              meta: { $ref: (0, import_swagger9.getSchemaPath)(PageMetaDTO) }
            }
          }
        ]
      }
    })
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiErrorResponses,
  ApiPaginatedResponse,
  ApiParamId,
  ApiPropertyCreatedAt,
  ApiPropertyId,
  ApiPropertyUpdatedAt,
  ApiResourceQuery
});
//# sourceMappingURL=decorators.cjs.map
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
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AggregateDTO: () => AggregateDTO,
  ApiErrorResponses: () => ApiErrorResponses,
  ApiFieldsQuery: () => ApiFieldsQuery,
  ApiPaginatedResponse: () => ApiPaginatedResponse,
  ApiParamId: () => ApiParamId,
  ApiPropertyCreatedAt: () => ApiPropertyCreatedAt,
  ApiPropertyId: () => ApiPropertyId,
  ApiPropertyUpdatedAt: () => ApiPropertyUpdatedAt,
  ApiResourceQuery: () => ApiResourceQuery,
  CHECK_POLICIES_KEY: () => CHECK_POLICIES_KEY,
  CheckPolicies: () => CheckPolicies,
  CountDTO: () => CountDTO,
  EmptyStringToNullPipe: () => EmptyStringToNullPipe,
  Fields: () => Fields,
  FieldsBadRequestException: () => FieldsBadRequestException,
  FieldsExceptionFilter: () => FieldsExceptionFilter,
  FieldsParser: () => FieldsParser,
  FieldsProjector: () => FieldsProjector,
  FieldsQuery: () => FieldsQuery,
  FieldsValidator: () => FieldsValidator,
  FindByIdDTO: () => FindByIdDTO,
  FindManyDTO: () => FindManyDTO,
  FindOneDTO: () => FindOneDTO,
  FindUniqueDTO: () => FindUniqueDTO,
  PageMetaDTO: () => PageMetaDTO,
  PageOptionsDTO: () => PageOptionsDTO,
  PaginatedDTO: () => PaginatedDTO,
  PoliciesGuard: () => PoliciesGuard,
  QueryDTO: () => QueryDTO,
  QueryService: () => QueryService,
  QueryTransformPipe: () => QueryTransformPipe,
  ResourceQuery: () => ResourceQuery,
  ValidationUtil: () => ValidationUtil,
  buildFieldSchemaFromDto: () => buildFieldSchemaFromDto,
  createCaslAccessibleWhere: () => createCaslAccessibleWhere,
  diffObjects: () => diffObjects,
  filterCaslFields: () => filterCaslFields,
  getDtoFields: () => getDtoFields,
  hasObjectDifferences: () => hasObjectDifferences,
  isBoolean: () => isBoolean,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  parseBoolean: () => parseBoolean,
  parseObject: () => parseObject,
  parseObjectProperties: () => parseObjectProperties,
  parseQueryObject: () => parseQueryObject,
  prepareFieldsQuery: () => prepareFieldsQuery,
  relation: () => relation,
  serializeDecimalValues: () => serializeDecimalValues
});
module.exports = __toCommonJS(src_exports);

// src/casl/adapter.ts
var import_prisma = require("@casl/prisma");
function createCaslAccessibleWhere(options = {}) {
  const action = options.action ?? "read";
  return (ability, subject2) => {
    const records = (0, import_prisma.accessibleBy)(ability, action);
    let ofType;
    try {
      ofType = records.ofType;
    } catch {
      return records[String(subject2)];
    }
    if (typeof ofType === "function") {
      return ofType.call(records, subject2);
    }
    return records[String(subject2)];
  };
}

// src/casl/check-policies.decorator.ts
var import_common = require("@nestjs/common");
var CHECK_POLICIES_KEY = "CHECK_POLICIES";
function CheckPolicies(...handlers) {
  return (0, import_common.SetMetadata)(CHECK_POLICIES_KEY, handlers);
}

// src/casl/dto-filter.ts
var import_ability = require("@casl/ability");
function filterCaslFields(dto, subjectName, ability, options = {}) {
  if (!ability) {
    return cloneDto(dto);
  }
  const action = options.action ?? "read";
  const dtoSubject = (0, import_ability.subject)(subjectName, cloneDto(dto));
  if (ability.can(action, dtoSubject, "all")) {
    return cloneDto(dto);
  }
  const filtered = createDtoShell(dto);
  const dtoFields = dto;
  const filteredFields = filtered;
  for (const key of Object.keys(dto)) {
    if (ability.can(action, dtoSubject, key)) {
      filteredFields[key] = dtoFields[key];
    }
  }
  return filtered;
}
function cloneDto(dto) {
  return Object.assign(createDtoShell(dto), dto);
}
function createDtoShell(dto) {
  return Object.create(Object.getPrototypeOf(dto));
}

// src/casl/policies.guard.ts
var import_common2 = require("@nestjs/common");
var import_core = require("@nestjs/core");
var PoliciesGuard = class {
  /**
   * Creates a policies guard.
   *
   * @param {Reflector} reflector Nest reflector used to read route metadata.
   */
  constructor(reflector) {
    this.reflector = reflector;
  }
  reflector;
  /**
   * Checks all policies configured through {@link CheckPolicies}.
   *
   * @param {ExecutionContext} context Nest execution context.
   * @returns {boolean} True when all policies pass.
   * @throws {ForbiddenException} When ability is missing or a policy fails.
   */
  canActivate(context) {
    const handlers = this.reflector.get(CHECK_POLICIES_KEY, context.getHandler()) ?? [];
    if (handlers.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.ability) {
      throw new import_common2.ForbiddenException("Insufficient permissions.");
    }
    if (!handlers.every((handler) => handler(request.ability))) {
      throw new import_common2.ForbiddenException("Insufficient permissions.");
    }
    return true;
  }
};
PoliciesGuard = __decorateClass([
  (0, import_common2.Injectable)(),
  __decorateParam(0, (0, import_common2.Inject)(import_core.Reflector))
], PoliciesGuard);

// src/decorators/params/api-param-id.decorator.ts
var import_common3 = require("@nestjs/common");
var import_swagger = require("@nestjs/swagger");
function ApiParamId(options = {}) {
  return (0, import_common3.applyDecorators)(
    (0, import_swagger.ApiParam)({
      name: options.name ?? "id",
      description: options.description,
      type: "string",
      format: "uuid"
    })
  );
}

// src/decorators/properties/api-property-created-at.decorator.ts
var import_common4 = require("@nestjs/common");
var import_swagger2 = require("@nestjs/swagger");
function ApiPropertyCreatedAt(options = {}) {
  return (0, import_common4.applyDecorators)(
    (0, import_swagger2.ApiProperty)({
      description: options.description ?? "The creation date of the item.",
      ...options
    })
  );
}

// src/decorators/properties/api-property-id.decorator.ts
var import_common5 = require("@nestjs/common");
var import_swagger3 = require("@nestjs/swagger");
function ApiPropertyId(options = {}) {
  return (0, import_common5.applyDecorators)(
    (0, import_swagger3.ApiProperty)({
      example: options.example ?? crypto.randomUUID(),
      description: options.description ?? "The ID of the item.",
      ...options
    })
  );
}

// src/decorators/properties/api-property-updated-at.decorator.ts
var import_common6 = require("@nestjs/common");
var import_swagger4 = require("@nestjs/swagger");
function ApiPropertyUpdatedAt(options = {}) {
  return (0, import_common6.applyDecorators)(
    (0, import_swagger4.ApiProperty)({
      description: options.description ?? "The updated date of the item.",
      ...options
    })
  );
}

// src/decorators/query/api-resource-query.decorator.ts
var import_common7 = require("@nestjs/common");
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
      statusCode: { type: "number", default: import_common7.HttpStatus.BAD_REQUEST },
      error: { type: "string", default: "Bad Request" },
      message: { type: "string" }
    }
  },
  examples: {
    invalidResourceQuery: {
      summary: "Invalid resource query",
      value: {
        statusCode: import_common7.HttpStatus.BAD_REQUEST,
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
  return (0, import_common7.applyDecorators)(...decorators);
}

// src/decorators/responses/api-error-responses.decorator.ts
var import_common10 = require("@nestjs/common");

// src/decorators/responses/error-responses/get-message-from-status-code.ts
var import_common8 = require("@nestjs/common");
function getMessageFromStatusCode(statusCode) {
  switch (statusCode) {
    case import_common8.HttpStatus.BAD_REQUEST:
      return "Bad Request";
    case import_common8.HttpStatus.UNAUTHORIZED:
      return "Unauthorized";
    case import_common8.HttpStatus.FORBIDDEN:
      return "Forbidden";
    case import_common8.HttpStatus.NOT_FOUND:
      return "Not Found";
    case import_common8.HttpStatus.CONFLICT:
      return "Conflict";
    case import_common8.HttpStatus.TOO_MANY_REQUESTS:
      return "Too Many Requests";
    case import_common8.HttpStatus.INTERNAL_SERVER_ERROR:
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
var import_common9 = require("@nestjs/common");
var import_swagger6 = require("@nestjs/swagger");
function getStatusConfigs(options) {
  return [
    {
      status: import_common9.HttpStatus.BAD_REQUEST,
      codes: options.badRequestCodes,
      description: options.badRequestDescription,
      decorator: import_swagger6.ApiBadRequestResponse
    },
    {
      status: import_common9.HttpStatus.UNAUTHORIZED,
      codes: options.unauthorizedCodes,
      description: options.unauthorizedDescription,
      decorator: import_swagger6.ApiUnauthorizedResponse
    },
    {
      status: import_common9.HttpStatus.FORBIDDEN,
      codes: options.forbiddenCodes,
      description: options.forbiddenDescription,
      decorator: import_swagger6.ApiForbiddenResponse
    },
    {
      status: import_common9.HttpStatus.NOT_FOUND,
      codes: options.notFoundCodes,
      description: options.notFoundDescription,
      decorator: import_swagger6.ApiNotFoundResponse
    },
    {
      status: import_common9.HttpStatus.CONFLICT,
      codes: options.conflictCodes,
      description: options.conflictDescription,
      decorator: import_swagger6.ApiConflictResponse
    },
    {
      status: import_common9.HttpStatus.TOO_MANY_REQUESTS,
      codes: options.tooManyRequestsCodes,
      description: options.tooManyRequestsDescription,
      decorator: import_swagger6.ApiTooManyRequestsResponse
    },
    {
      status: import_common9.HttpStatus.INTERNAL_SERVER_ERROR,
      codes: options.internalServerErrorCodes,
      description: options.internalServerErrorDescription ?? (options.internalServerError ? getMessageFromStatusCode(import_common9.HttpStatus.INTERNAL_SERVER_ERROR) : void 0),
      decorator: import_swagger6.ApiInternalServerErrorResponse
    }
  ];
}

// src/decorators/responses/api-error-responses.decorator.ts
function ApiErrorResponses(options = {}) {
  const decorators = getStatusConfigs(options).filter((config) => config.codes || config.description).map((config) => config.decorator(getResponseDecoratorOptions(config.status, config.codes, config.description)));
  return (0, import_common10.applyDecorators)(...decorators);
}

// src/decorators/responses/api-paginated-response.decorator.ts
var import_common11 = require("@nestjs/common");
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
  return (0, import_common11.applyDecorators)(
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

// src/dto/aggregate.dto.ts
var import_swagger10 = require("@nestjs/swagger");
var import_class_transformer3 = require("class-transformer");
var import_class_validator2 = require("class-validator");
var AggregateDTO = class {
  where;
  orderBy;
  cursor;
  take;
  skip;
  _count;
  _min;
  _max;
  _avg;
  _sum;
};
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "where", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma orderBy object or array." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "orderBy", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma cursor object." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "cursor", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Maximum number of items to aggregate.", minimum: 1 }),
  (0, import_class_transformer3.Type)(() => Number),
  (0, import_class_validator2.IsInt)(),
  (0, import_class_validator2.Min)(1),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "take", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Number of items to skip.", minimum: 0 }),
  (0, import_class_transformer3.Type)(() => Number),
  (0, import_class_validator2.IsInt)(),
  (0, import_class_validator2.Min)(0),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "skip", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma _count aggregate selector." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "_count", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma _min aggregate selector." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "_min", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma _max aggregate selector." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "_max", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma _avg aggregate selector." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "_avg", 2);
__decorateClass([
  (0, import_swagger10.ApiPropertyOptional)({ description: "Prisma _sum aggregate selector." }),
  (0, import_class_validator2.IsOptional)()
], AggregateDTO.prototype, "_sum", 2);

// src/dto/count.dto.ts
var import_swagger11 = require("@nestjs/swagger");
var import_class_validator3 = require("class-validator");
var CountDTO = class {
  where;
};
__decorateClass([
  (0, import_swagger11.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator3.IsOptional)()
], CountDTO.prototype, "where", 2);

// src/dto/find-by-id.dto.ts
var import_swagger12 = require("@nestjs/swagger");
var import_class_validator4 = require("class-validator");
var FindByIdDTO = class {
  fields;
  select;
  include;
};
__decorateClass([
  (0, import_swagger12.ApiPropertyOptional)({ description: "Fields projection query, for example `id,name,profile{firstName}`." }),
  (0, import_class_validator4.IsString)(),
  (0, import_class_validator4.IsOptional)()
], FindByIdDTO.prototype, "fields", 2);
__decorateClass([
  (0, import_swagger12.ApiPropertyOptional)({ description: "Prisma select object." }),
  (0, import_class_validator4.IsOptional)()
], FindByIdDTO.prototype, "select", 2);
__decorateClass([
  (0, import_swagger12.ApiPropertyOptional)({ description: "Prisma include object." }),
  (0, import_class_validator4.IsOptional)()
], FindByIdDTO.prototype, "include", 2);

// src/dto/find-many.dto.ts
var import_swagger14 = require("@nestjs/swagger");
var import_class_transformer4 = require("class-transformer");
var import_class_validator6 = require("class-validator");

// src/dto/find-one.dto.ts
var import_swagger13 = require("@nestjs/swagger");
var import_class_validator5 = require("class-validator");
var FindOneDTO = class {
  select;
  include;
  where;
  orderBy;
  cursor;
  distinct;
};
__decorateClass([
  (0, import_swagger13.ApiPropertyOptional)({ description: "Prisma select object." }),
  (0, import_class_validator5.IsOptional)()
], FindOneDTO.prototype, "select", 2);
__decorateClass([
  (0, import_swagger13.ApiPropertyOptional)({ description: "Prisma include object." }),
  (0, import_class_validator5.IsOptional)()
], FindOneDTO.prototype, "include", 2);
__decorateClass([
  (0, import_swagger13.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator5.IsOptional)()
], FindOneDTO.prototype, "where", 2);
__decorateClass([
  (0, import_swagger13.ApiPropertyOptional)({ description: "Prisma orderBy object or array." }),
  (0, import_class_validator5.IsOptional)()
], FindOneDTO.prototype, "orderBy", 2);
__decorateClass([
  (0, import_swagger13.ApiPropertyOptional)({ description: "Prisma cursor object." }),
  (0, import_class_validator5.IsOptional)()
], FindOneDTO.prototype, "cursor", 2);
__decorateClass([
  (0, import_swagger13.ApiPropertyOptional)({ description: "Prisma distinct field or fields." }),
  (0, import_class_validator5.IsOptional)()
], FindOneDTO.prototype, "distinct", 2);

// src/dto/find-many.dto.ts
var FindManyDTO = class extends FindOneDTO {
  take;
  skip;
};
__decorateClass([
  (0, import_swagger14.ApiPropertyOptional)({ description: "Maximum number of items to return.", minimum: 1 }),
  (0, import_class_transformer4.Type)(() => Number),
  (0, import_class_validator6.IsInt)(),
  (0, import_class_validator6.Min)(1),
  (0, import_class_validator6.IsOptional)()
], FindManyDTO.prototype, "take", 2);
__decorateClass([
  (0, import_swagger14.ApiPropertyOptional)({ description: "Number of items to skip.", minimum: 0 }),
  (0, import_class_transformer4.Type)(() => Number),
  (0, import_class_validator6.IsInt)(),
  (0, import_class_validator6.Min)(0),
  (0, import_class_validator6.IsOptional)()
], FindManyDTO.prototype, "skip", 2);

// src/dto/find-unique.dto.ts
var import_swagger15 = require("@nestjs/swagger");
var import_class_validator7 = require("class-validator");
var FindUniqueDTO = class extends FindByIdDTO {
  where;
};
__decorateClass([
  (0, import_swagger15.ApiPropertyOptional)({ description: "Prisma unique where object." }),
  (0, import_class_validator7.IsOptional)()
], FindUniqueDTO.prototype, "where", 2);

// src/dto/query.dto.ts
var import_swagger17 = require("@nestjs/swagger");
var import_class_validator9 = require("class-validator");

// src/pagination/page-options.dto.ts
var import_swagger16 = require("@nestjs/swagger");
var import_class_transformer5 = require("class-transformer");
var import_class_validator8 = require("class-validator");
var PageOptionsDTO = class {
  page = 1;
  perPage = 10;
};
__decorateClass([
  (0, import_swagger16.ApiPropertyOptional)({ type: Number, description: "Current page number.", default: 1, minimum: 1 }),
  (0, import_class_transformer5.Type)(() => Number),
  (0, import_class_validator8.IsInt)(),
  (0, import_class_validator8.Min)(1),
  (0, import_class_validator8.IsOptional)()
], PageOptionsDTO.prototype, "page", 2);
__decorateClass([
  (0, import_swagger16.ApiPropertyOptional)({
    type: Number,
    description: "Number of items per page.",
    default: 10,
    minimum: 1,
    maximum: 1e3
  }),
  (0, import_class_transformer5.Type)(() => Number),
  (0, import_class_validator8.IsInt)(),
  (0, import_class_validator8.Min)(1),
  (0, import_class_validator8.Max)(1e3),
  (0, import_class_validator8.IsOptional)()
], PageOptionsDTO.prototype, "perPage", 2);

// src/dto/query.dto.ts
var QueryDTO = class extends PageOptionsDTO {
  fields;
  select;
  include;
  where;
  orderBy;
  cursor;
  distinct;
};
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Fields projection query, for example `id,name,profile{firstName}`." }),
  (0, import_class_validator9.IsString)(),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "fields", 2);
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Prisma select object." }),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "select", 2);
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Prisma include object." }),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "include", 2);
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "where", 2);
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Prisma orderBy object or array." }),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "orderBy", 2);
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Prisma cursor object." }),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "cursor", 2);
__decorateClass([
  (0, import_swagger17.ApiPropertyOptional)({ description: "Prisma distinct field or fields." }),
  (0, import_class_validator9.IsOptional)()
], QueryDTO.prototype, "distinct", 2);

// src/fields/api-fields-query.decorator.ts
var import_common12 = require("@nestjs/common");
var import_swagger18 = require("@nestjs/swagger");
var defaultQueryDescription = "Comma-separated response field projection. Use nested selections with braces, for example `id,name,profile{email}`.";
var defaultBadRequestDescription = "The `fields` query parameter is invalid.";
function ApiFieldsQuery(options = {}) {
  return (0, import_common12.applyDecorators)(
    (0, import_swagger18.ApiQuery)({
      name: "fields",
      required: false,
      type: String,
      description: defaultQueryDescription,
      ...options.query
    }),
    (0, import_swagger18.ApiBadRequestResponse)({
      description: defaultBadRequestDescription,
      schema: {
        type: "object",
        required: ["statusCode", "message", "details"],
        properties: {
          statusCode: {
            type: "number",
            example: 400
          },
          message: {
            type: "string",
            example: "Invalid fields query parameter"
          },
          details: {
            type: "string",
            example: 'unknown field "name"'
          },
          path: {
            type: "string",
            example: "profile.name"
          },
          position: {
            type: "number",
            example: 8
          }
        }
      },
      ...options.badRequest
    })
  );
}

// src/fields/core/bad-request.exception.ts
var import_common13 = require("@nestjs/common");
var FieldsBadRequestException = class extends import_common13.BadRequestException {
  /**
   * Creates a structured fields bad request error.
   *
   * @param {FieldsBadRequestResponse} response The response body details.
   */
  constructor(response) {
    super(response);
  }
};

// src/fields/core/schema.ts
function relation(fields) {
  return { relation: true, fields };
}
function isRelationSchemaNode(node) {
  return node !== true;
}

// src/fields/core/dto-schema.ts
var SWAGGER_PROPERTIES_ARRAY = "swagger/apiModelPropertiesArray";
var SWAGGER_PROPERTY = "swagger/apiModelProperties";
function getDtoFields(dtoClass) {
  const fields = Reflect.getMetadata?.(SWAGGER_PROPERTIES_ARRAY, dtoClass.prototype) ?? [];
  if (!Array.isArray(fields)) {
    return [];
  }
  return fields.filter((field) => typeof field === "string").map((field) => field.replace(":", ""));
}
function resolvePropertyType(dtoClass, field) {
  const getMetadata = Reflect.getMetadata;
  const swaggerProperty = getMetadata?.(SWAGGER_PROPERTY, dtoClass.prototype, field);
  let resolvedType = swaggerProperty?.type;
  if (typeof resolvedType === "function") {
    try {
      resolvedType = resolvedType();
    } catch {
    }
  }
  if (Array.isArray(resolvedType) && resolvedType.length === 1) {
    resolvedType = resolvedType[0];
  }
  if (typeof resolvedType === "undefined") {
    resolvedType = getMetadata?.("design:type", dtoClass.prototype, field);
  }
  return resolvedType;
}
function isDtoClass(value) {
  if (typeof value !== "function" || !value.prototype) {
    return false;
  }
  const fields = Reflect.getMetadata?.(SWAGGER_PROPERTIES_ARRAY, value.prototype);
  return Array.isArray(fields) && fields.length > 0;
}
function buildFieldSchemaFromDto(dtoClass, visited = /* @__PURE__ */ new Set()) {
  const schema = {};
  for (const field of getDtoFields(dtoClass)) {
    const fieldType = resolvePropertyType(dtoClass, field);
    if (isDtoClass(fieldType)) {
      if (visited.has(fieldType)) {
        schema[field] = relation({});
      } else {
        const nextVisited = new Set(visited);
        nextVisited.add(fieldType);
        schema[field] = relation(buildFieldSchemaFromDto(fieldType, nextVisited));
      }
    } else {
      schema[field] = true;
    }
  }
  return schema;
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

// src/fields/core/include.ts
function mergeInclude(base, extension) {
  const parsedBase = normalizeInclude(base);
  const parsedExtension = normalizeInclude(extension);
  if (!parsedBase) {
    return parsedExtension;
  }
  if (!parsedExtension) {
    return parsedBase;
  }
  return mergeIncludeObjects(parsedBase, parsedExtension);
}
function buildFieldsInclude(projection, schema, existing) {
  const parsedExisting = parseObject(existing);
  const current = parsedExisting && typeof parsedExisting === "object" && !Array.isArray(parsedExisting) ? parsedExisting : {};
  const result = { ...current };
  for (const key of Object.keys(projection)) {
    const node = schema[key];
    if (!node || !isRelationSchemaNode(node)) {
      continue;
    }
    const selected = projection[key];
    const nested = selected === true ? {} : buildFieldsInclude(selected, node.fields);
    const generated = selected === true || Object.keys(nested).length === 0 ? true : { include: nested };
    const configured = result[key];
    if (configured && typeof configured === "object" && !Array.isArray(configured) && generated !== true) {
      const configuredObject = configured;
      if (typeof configuredObject.select === "object" && configuredObject.select !== null && !Array.isArray(configuredObject.select)) {
        result[key] = {
          ...configuredObject,
          select: {
            ...configuredObject.select,
            ...generated.include
          }
        };
        continue;
      }
      result[key] = {
        ...configuredObject,
        include: {
          ...typeof configuredObject.include === "object" && configuredObject.include !== null && !Array.isArray(configuredObject.include) ? configuredObject.include : {},
          ...generated.include
        }
      };
    } else if (typeof configured === "undefined" || configured === true && generated !== true) {
      result[key] = generated;
    }
  }
  return result;
}
function normalizeInclude(include) {
  const parsed = parseObject(include);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return void 0;
  }
  return parsed;
}
function mergeIncludeObjects(base, extension) {
  const result = { ...base };
  for (const [key, value] of Object.entries(extension)) {
    const current = result[key];
    if (isPlainIncludeObject(current) && isPlainIncludeObject(value)) {
      result[key] = mergeIncludeObjects(current, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function isPlainIncludeObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

// src/fields/core/selection-parser.ts
var FieldsSelectionParser = class {
  /**
   * Creates a parser for one raw `fields` string.
   *
   * @param {string} input The raw fields string.
   */
  constructor(input) {
    this.input = input;
  }
  input;
  pos = 0;
  /**
   * Parses the full input into a projection tree.
   *
   * @returns {FieldsProjection} The parsed projection tree.
   * @throws {FieldsBadRequestException} If the syntax is invalid.
   */
  parse() {
    if (this.input === "") {
      return {};
    }
    this.skipWhitespace();
    if (!this.hasMore()) {
      throw this.error("fields cannot be empty");
    }
    const projection = this.peek() === "{" ? this.parseWrappedSelection() : this.parseSelectionList();
    this.skipWhitespace();
    if (this.hasMore()) {
      throw this.error(`unexpected token "${this.peek()}"`);
    }
    return projection;
  }
  /**
   * Parses a comma-separated selection list.
   *
   * @returns {FieldsProjection} The parsed selection set.
   */
  parseSelectionList(allowEmpty = false) {
    const selection = {};
    while (true) {
      this.skipWhitespace();
      if (!this.hasMore() || this.peek() === "}") {
        break;
      }
      const fieldName = this.parseName();
      this.skipWhitespace();
      let child = true;
      if (this.peek() === "{") {
        this.consume("{");
        child = this.parseSelectionList(true);
        this.skipWhitespace();
        this.consume("}");
      }
      const current = selection[fieldName];
      if (typeof current === "undefined") {
        selection[fieldName] = child;
      } else if (current !== true && child !== true) {
        selection[fieldName] = { ...current, ...child };
      }
      this.skipWhitespace();
      if (this.peek() === ",") {
        this.consume(",");
        continue;
      }
      if (!this.hasMore() || this.peek() === "}") {
        break;
      }
      throw this.error("expected comma or closing brace");
    }
    if (!allowEmpty && Object.keys(selection).length === 0) {
      throw this.error("selection set cannot be empty");
    }
    return selection;
  }
  /**
   * Parses an optional outer selection wrapper.
   *
   * @returns {FieldsProjection} The selection inside the outer braces.
   */
  parseWrappedSelection() {
    this.consume("{");
    const selection = this.parseSelectionList(true);
    this.skipWhitespace();
    this.consume("}");
    return selection;
  }
  /**
   * Parses one field identifier.
   *
   * @returns {string} The parsed field name.
   */
  parseName() {
    if (!this.hasMore()) {
      throw this.error("unexpected end of input while reading field name");
    }
    const start = this.pos;
    const first = this.peek();
    if (!/[A-Za-z_]/.test(first)) {
      throw this.error(`invalid field start "${first}"`);
    }
    this.pos++;
    while (this.hasMore() && /[A-Za-z0-9_]/.test(this.peek())) {
      this.pos++;
    }
    return this.input.slice(start, this.pos);
  }
  /**
   * Advances the parser position over whitespace.
   *
   * @returns {void}
   */
  skipWhitespace() {
    while (this.hasMore() && /\s/.test(this.peek())) {
      this.pos++;
    }
  }
  /**
   * Checks whether input remains.
   *
   * @returns {boolean} `true` when the parser has not reached the end.
   */
  hasMore() {
    return this.pos < this.input.length;
  }
  /**
   * Reads the current character without consuming it.
   *
   * @returns {string} The current character.
   */
  peek() {
    return this.input[this.pos] ?? "";
  }
  /**
   * Consumes an expected token.
   *
   * @param {string} ch The expected character to consume.
   * @returns {void}
   */
  consume(ch) {
    if (this.peek() !== ch) {
      throw this.error(`expected "${ch}"`);
    }
    this.pos++;
  }
  /**
   * Builds a standardized bad request exception.
   *
   * @param {string} details The parser error details.
   * @returns {FieldsBadRequestException} The structured bad request exception.
   */
  error(details) {
    return new FieldsBadRequestException({
      message: "Invalid fields query parameter",
      details,
      position: this.pos
    });
  }
};

// src/fields/core/parser.ts
var FieldsParser = class {
  /**
   * Parses a `fields` value into a projection tree.
   *
   * @param {unknown} value The raw `fields` query parameter value.
   * @returns {FieldsProjection | undefined} The parsed projection tree, an empty projection for an explicit empty string, or `undefined` when omitted.
   * @throws {FieldsBadRequestException} If the value type or syntax is invalid.
   */
  static parse(value) {
    if (typeof value === "undefined" || value === null) {
      return void 0;
    }
    if (typeof value !== "string") {
      throw new FieldsBadRequestException({
        message: "Invalid fields query parameter",
        details: "fields must be a string"
      });
    }
    return new FieldsSelectionParser(value).parse();
  }
};

// src/fields/core/projector.ts
var FieldsProjector = class {
  /**
   * Projects any source value to the requested shape.
   *
   * @param {T} value The source value to project.
   * @param {FieldsProjection} [projection] The requested fields tree.
   * @returns {T} The projected value.
   */
  static project(value, projection) {
    if (!projection) {
      return value;
    }
    return this.projectInternal(value, projection);
  }
  /**
   * Recursively projects one value.
   *
   * @param {unknown} value The current source value.
   * @param {FieldsProjection | true} projection The projection node.
   * @returns {unknown} The projected value for the current node.
   */
  static projectInternal(value, projection) {
    if (projection === true) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.projectInternal(item, projection));
    }
    if (value === null || typeof value === "undefined") {
      return value;
    }
    if (typeof value !== "object") {
      return value;
    }
    const source = value;
    const out = {};
    for (const key of Object.keys(projection)) {
      out[key] = this.projectInternal(source[key], projection[key]);
    }
    return out;
  }
};

// src/fields/util/validator.helpers.ts
function fieldsValidationBadRequest(details, path) {
  return new FieldsBadRequestException({
    message: "Invalid fields query parameter",
    details,
    path
  });
}
function getIncludeChild(include, key) {
  if (!isPlainObject(include)) {
    return void 0;
  }
  return include[key];
}
function hasNestedRelationSelection(projection, schema) {
  for (const key of Object.keys(projection)) {
    const projectionNode = projection[key];
    const schemaNode = schema[key];
    if (!schemaNode || !isRelationSchemaNode(schemaNode) || projectionNode === true) {
      continue;
    }
    return true;
  }
  return false;
}
function getNestedIncludeContext(includeChild) {
  if (includeChild === true) {
    return true;
  }
  if (!isPlainObject(includeChild)) {
    return void 0;
  }
  if (isPlainObject(includeChild.include)) {
    return includeChild.include;
  }
  return includeChild;
}

// src/fields/core/validator.ts
var FieldsValidator = class {
  /**
   * Validates field names and nesting against a schema.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {string} [path] The internal traversal path.
   * @returns {void}
   * @throws {FieldsBadRequestException} If an unknown field or invalid nesting is used.
   */
  static validateProjection(projection, schema, path = "") {
    for (const key of Object.keys(projection)) {
      const node = schema[key];
      const fieldPath = path ? `${path}.${key}` : key;
      if (!node) {
        throw fieldsValidationBadRequest(`unknown field "${key}"`, fieldPath);
      }
      const projectionNode = projection[key];
      if (projectionNode !== true) {
        if (!isRelationSchemaNode(node)) {
          throw fieldsValidationBadRequest(`field "${key}" does not support nested selections`, fieldPath);
        }
        this.validateProjection(projectionNode, node.fields, fieldPath);
      }
    }
  }
  /**
   * Ensures a projection only contains top-level fields.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @returns {void}
   * @throws {FieldsBadRequestException} If nested selections are present.
   */
  static validateNoNestedSelection(projection) {
    for (const key of Object.keys(projection)) {
      if (projection[key] !== true) {
        throw fieldsValidationBadRequest(`nested selection is not supported on this endpoint (field "${key}")`, key);
      }
    }
  }
  /**
   * Validates that selected relation fields are backed by explicit includes.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {unknown} include The include query object.
   * @param {string} [path] The internal traversal path.
   * @returns {void}
   * @throws {FieldsBadRequestException} If required include values are missing.
   */
  static validateIncludeRequirements(projection, schema, include, path = "") {
    for (const key of Object.keys(projection)) {
      const node = schema[key];
      const projectionNode = projection[key];
      if (!isRelationSchemaNode(node)) {
        continue;
      }
      const fieldPath = path ? `${path}.${key}` : key;
      const includeChild = getIncludeChild(include, key);
      if (typeof includeChild === "undefined") {
        throw fieldsValidationBadRequest(
          `relation field "${fieldPath}" requires include (missing include.${fieldPath})`,
          fieldPath
        );
      }
      if (projectionNode === true) {
        continue;
      }
      const nestedInclude = getNestedIncludeContext(includeChild);
      if (nestedInclude === true && hasNestedRelationSelection(projectionNode, node.fields)) {
        throw fieldsValidationBadRequest(
          `nested relation selection for "${fieldPath}" requires explicit nested include`,
          fieldPath
        );
      }
      this.validateIncludeRequirements(
        projectionNode,
        node.fields,
        nestedInclude === true ? void 0 : nestedInclude,
        fieldPath
      );
    }
  }
};

// src/fields/core/fields.ts
var Fields = class {
  /**
   * Builds a Prisma-compatible include object from a validated projection.
   *
   * Existing include configuration is preserved and dotted query keys are
   * normalized through the bundled object utilities.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {unknown} [existing] The existing include query configuration.
   * @returns {Record<string, unknown>} The merged include configuration.
   */
  static include(projection, schema, existing) {
    return buildFieldsInclude(projection, schema, existing);
  }
  /**
   * Parses and validates a raw `fields` value.
   *
   * @param {unknown} rawFields The raw query parameter value.
   * @param {FieldSchema} schema The allowed DTO field schema.
   * @param {FieldsParseOptions} [options] The validation options.
   * @returns {FieldsProjection | undefined} The parsed projection, an empty projection for an explicit empty string, or `undefined` when omitted.
   * @throws {FieldsBadRequestException} If parsing or validation fails.
   */
  static parseAndValidate(rawFields, schema, options) {
    const projection = FieldsParser.parse(rawFields);
    if (!projection) {
      return void 0;
    }
    FieldsValidator.validateProjection(projection, schema);
    if (options?.allowNested === false) {
      FieldsValidator.validateNoNestedSelection(projection);
    }
    if (options?.requireIncludeForRelations) {
      FieldsValidator.validateIncludeRequirements(projection, schema, options.include);
    }
    return projection;
  }
  /**
   * Applies a projection to a source value.
   *
   * @param {T} value The source value.
   * @param {FieldsProjection} [projection] The parsed projection tree.
   * @returns {T} The projected value.
   */
  static project(value, projection) {
    return FieldsProjector.project(value, projection);
  }
};

// src/fields/fields-query.decorator.ts
var import_common14 = require("@nestjs/common");
var FieldsQueryParam = (0, import_common14.createParamDecorator)(
  (data, context) => {
    const request = context.switchToHttp().getRequest();
    const schema = buildFieldSchemaFromDto(data.dtoClass);
    return Fields.parseAndValidate(request.query?.fields, schema, data.options);
  }
);
function FieldsQuery(dtoClass, options) {
  return FieldsQueryParam({ dtoClass, options });
}

// src/fields/filters/exception.filter.ts
var import_common15 = require("@nestjs/common");
var FieldsExceptionFilter = class {
  /**
   * Writes the fields error response through the active HTTP adapter response.
   *
   * @param {FieldsBadRequestException} exception The fields parser or validator exception.
   * @param {ArgumentsHost} host The Nest arguments host.
   * @returns {void}
   */
  catch(exception, host) {
    const response = host.switchToHttp().getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    response.status(statusCode).json({
      statusCode,
      ...typeof exceptionResponse === "object" ? exceptionResponse : { message: exceptionResponse }
    });
  }
};
FieldsExceptionFilter = __decorateClass([
  (0, import_common15.Catch)(FieldsBadRequestException)
], FieldsExceptionFilter);

// src/fields/prepare-fields-query.ts
function prepareFieldsQuery(query, schemaOrDto, options) {
  const schema = resolveFieldSchema(schemaOrDto);
  const mergedInclude = mergeInclude(options?.baseInclude, query.include);
  const projection = Fields.parseAndValidate(query.fields, schema, {
    ...options,
    include: options?.include ?? mergedInclude
  });
  if (!projection) {
    return {
      query: {
        ...query,
        ...typeof mergedInclude === "undefined" ? {} : { include: mergedInclude }
      },
      projection
    };
  }
  return {
    query: {
      ...query,
      include: Fields.include(projection, schema, mergedInclude)
    },
    projection
  };
}
function resolveFieldSchema(schemaOrDto) {
  if (typeof schemaOrDto === "function") {
    return buildFieldSchemaFromDto(schemaOrDto);
  }
  return schemaOrDto;
}

// src/pipes/empty-string-to-null.pipe.ts
var import_common16 = require("@nestjs/common");
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
  (0, import_common16.Injectable)()
], EmptyStringToNullPipe);

// src/pipes/query-transform.pipe.ts
var import_common17 = require("@nestjs/common");
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
(0, import_common17.Injectable)()(QueryTransformPipe);

// src/query-service/query.service.ts
var import_common19 = require("@nestjs/common");

// src/util/query/parse-query-object.ts
function parseQueryObject(value) {
  return parseObject(value);
}

// src/query-service/errors/handle-query-service-error.ts
var import_common18 = require("@nestjs/common");

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
    throw new import_common18.BadRequestException({ message: "Invalid query.", options, parsedArgs: args });
  }
  if (isKnownRequestErrorLike(error)) {
    throw new import_common18.BadRequestException({
      message: error.message.split("\n\n\n")[1] ?? "Invalid data",
      code: error.code,
      data: error.meta
    });
  }
  if (error instanceof import_common18.HttpException) {
    throw error;
  }
  errorLogger?.error(error);
  throw new import_common18.InternalServerErrorException();
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
        throw new import_common19.NotFoundException("Item not found.");
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
        throw new import_common19.NotFoundException("Item not found.");
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
        throw new import_common19.ForbiddenException("Insufficient permissions.");
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
  (0, import_common19.Injectable)()
], QueryService);

// src/resource-query-paginated.ts
var pageMetaFieldSchema = {
  page: true,
  perPage: true,
  itemCount: true,
  pageCount: true,
  hasPrevPage: true,
  hasNextPage: true
};
function preparePaginatedFieldsQuery(query, schemaOrDto, options) {
  const itemSchema = resolveFieldSchema(schemaOrDto);
  const responseSchema = {
    items: relation(itemSchema),
    meta: relation(pageMetaFieldSchema)
  };
  const parsedProjection = FieldsParser.parse(query.fields);
  if (parsedProjection && (isEmptyProjection(parsedProjection) || hasPaginatedProjectionShape(parsedProjection))) {
    const responseProjection = Fields.parseAndValidate(query.fields, responseSchema, options);
    const itemProjection = getItemProjection(responseProjection);
    const include = itemProjection ? Fields.include(itemProjection, itemSchema, mergeInclude(options?.baseInclude, query.include)) : mergeInclude(options?.baseInclude, query.include);
    return {
      query: {
        ...query,
        ...typeof include === "undefined" ? {} : { include }
      },
      itemProjection,
      responseProjection
    };
  }
  const prepared = prepareFieldsQuery(query, schemaOrDto, options);
  return {
    query: prepared.query,
    itemProjection: prepared.projection,
    responseProjection: void 0
  };
}
function hasPaginatedProjectionShape(projection) {
  return Object.keys(projection).some((key) => key === "items" || key === "meta");
}
function isEmptyProjection(projection) {
  return Object.keys(projection).length === 0;
}
function getItemProjection(projection) {
  const items = projection.items;
  return items && items !== true ? items : void 0;
}

// src/resource-query.ts
var ResourceQuery = class {
  /**
   * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
   *
   * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
   * @returns {Promise<PaginatedDTO<TDto>>} Projected paginated response DTO.
   */
  static async query(options) {
    const prepared = preparePaginatedFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude
    });
    const result = await options.service.query(prepared.query, options.ability);
    const dtoItems = await Promise.all(result.items.map((item) => options.map(item, options.ability)));
    const response = new PaginatedDTO(dtoItems, result.pageMeta);
    if (prepared.responseProjection) {
      return Fields.project(response, prepared.responseProjection);
    }
    return new PaginatedDTO(Fields.project(dtoItems, prepared.itemProjection), result.pageMeta);
  }
  /**
   * Finds one resource by ID, maps it to a DTO and applies the requested fields projection.
   *
   * @param {ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Find options.
   * @returns {Promise<TDto>} Projected response DTO.
   */
  static async findById(options) {
    const prepared = prepareFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude
    });
    const model = await options.service.findById(options.id, prepared.query, options.ability);
    const dto = await options.map(model, options.ability);
    return Fields.project(dto, prepared.projection);
  }
};

// src/util/validation.ts
var import_class_validator10 = require("class-validator");
var ValidationUtil = class {
  /**
   * Returns validation metadata for a specific validation error target.
   *
   * @param {ValidationError} error The validation error to inspect.
   * @returns {ValidationMetadata[]} The metadata entries for the error target.
   */
  static getMetaData(error) {
    if (!error.target) {
      return [];
    }
    return (0, import_class_validator10.getMetadataStorage)().getTargetValidationMetadatas(
      error.target.constructor,
      error.target.constructor.name,
      true,
      false
    );
  }
  /**
   * Processes constraints for a specific validation error.
   *
   * @param {ValidationError} error The error to process.
   * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
   * @returns {ValidationErrorDescription[]} The normalized constraint descriptions.
   */
  static processConstraints(error, metaData) {
    const result = [];
    for (const [key, message] of Object.entries(error.constraints ?? {})) {
      const meta = metaData.find((x) => x.propertyName === error.property && x.name === key);
      if (meta) {
        result.push({
          name: meta.name ?? key,
          constraints: (meta.constraints ?? []).filter(Boolean).map(String)
        });
      } else {
        result.push({ name: key, constraints: [message] });
      }
    }
    return result;
  }
  /**
   * Recursively processes child validation errors into a nested error map.
   *
   * @param {ValidationError[]} children The child errors to process.
   * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
   * @returns {ValidationPropertyErrors} The nested error structure.
   */
  static processChildren(children, metaData) {
    const nestedErrors = {};
    for (const child of children) {
      if (child.constraints) {
        nestedErrors[child.property] = this.processConstraints(child, metaData);
      }
      if (child.children && child.children.length > 0) {
        nestedErrors[child.property] = this.processChildren(child.children, metaData);
      }
    }
    return nestedErrors;
  }
  /**
   * Maps class-validator errors into a structured object representation.
   *
   * @param {ValidationError[]} errors The validation errors to map.
   * @returns {ValidationPropertyErrors} The mapped validation errors.
   */
  static mapValidationErrorsToObject(errors) {
    const result = {};
    for (const error of errors) {
      const metaData = this.getMetaData(error);
      if (error.constraints) {
        result[error.property] = this.processConstraints(error, metaData);
      }
      if (error.children && error.children.length > 0) {
        result[error.property] = this.processChildren(error.children, metaData);
      }
    }
    return result;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AggregateDTO,
  ApiErrorResponses,
  ApiFieldsQuery,
  ApiPaginatedResponse,
  ApiParamId,
  ApiPropertyCreatedAt,
  ApiPropertyId,
  ApiPropertyUpdatedAt,
  ApiResourceQuery,
  CHECK_POLICIES_KEY,
  CheckPolicies,
  CountDTO,
  EmptyStringToNullPipe,
  Fields,
  FieldsBadRequestException,
  FieldsExceptionFilter,
  FieldsParser,
  FieldsProjector,
  FieldsQuery,
  FieldsValidator,
  FindByIdDTO,
  FindManyDTO,
  FindOneDTO,
  FindUniqueDTO,
  PageMetaDTO,
  PageOptionsDTO,
  PaginatedDTO,
  PoliciesGuard,
  QueryDTO,
  QueryService,
  QueryTransformPipe,
  ResourceQuery,
  ValidationUtil,
  buildFieldSchemaFromDto,
  createCaslAccessibleWhere,
  diffObjects,
  filterCaslFields,
  getDtoFields,
  hasObjectDifferences,
  isBoolean,
  isNumber,
  isObject,
  isPlainObject,
  parseBoolean,
  parseObject,
  parseObjectProperties,
  parseQueryObject,
  prepareFieldsQuery,
  relation,
  serializeDecimalValues
});
//# sourceMappingURL=index.cjs.map
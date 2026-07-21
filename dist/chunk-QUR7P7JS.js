import {
  PaginatedDTO
} from "./chunk-MZ5JIS52.js";
import {
  PageMetaDTO
} from "./chunk-V7UTPUGM.js";

// src/decorators/params/api-param-id.decorator.ts
import { applyDecorators } from "@nestjs/common";
import { ApiParam } from "@nestjs/swagger";
function ApiParamId(options = {}) {
  return applyDecorators(
    ApiParam({
      name: options.name ?? "id",
      description: options.description,
      type: "string",
      format: "uuid"
    })
  );
}

// src/decorators/properties/api-property-created-at.decorator.ts
import { applyDecorators as applyDecorators2 } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
function ApiPropertyCreatedAt(options = {}) {
  return applyDecorators2(
    ApiProperty({
      description: options.description ?? "The creation date of the item.",
      ...options
    })
  );
}

// src/decorators/properties/api-property-id.decorator.ts
import { applyDecorators as applyDecorators3 } from "@nestjs/common";
import { ApiProperty as ApiProperty2 } from "@nestjs/swagger";
function ApiPropertyId(options = {}) {
  return applyDecorators3(
    ApiProperty2({
      example: options.example ?? crypto.randomUUID(),
      description: options.description ?? "The ID of the item.",
      ...options
    })
  );
}

// src/decorators/properties/api-property-updated-at.decorator.ts
import { applyDecorators as applyDecorators4 } from "@nestjs/common";
import { ApiProperty as ApiProperty3 } from "@nestjs/swagger";
function ApiPropertyUpdatedAt(options = {}) {
  return applyDecorators4(
    ApiProperty3({
      description: options.description ?? "The updated date of the item.",
      ...options
    })
  );
}

// src/decorators/query/api-resource-query.decorator.ts
import { applyDecorators as applyDecorators5 } from "@nestjs/common";
import { ApiBadRequestResponse, ApiQuery } from "@nestjs/swagger";
var queryObjectSchema = {
  oneOf: [{ type: "object" }, { type: "string" }]
};
function ApiResourceQuery(options = {}) {
  const decorators = [
    ApiQuery({
      name: "fields",
      required: false,
      type: String,
      description: "Response field projection. Use `id,title` for item fields or `items{id,title},meta{page,perPage}` for paginated envelopes.",
      example: "items{id,title,author{name}},meta{page,perPage,itemCount,pageCount}"
    }),
    ApiQuery({
      name: "select",
      required: false,
      schema: queryObjectSchema,
      description: "Prisma select object. Invalid select values are reported as HTTP 400 by the service layer."
    }),
    ApiQuery({
      name: "include",
      required: false,
      schema: queryObjectSchema,
      description: "Prisma include object. Client includes are merged with endpoint-required includes and fields-generated relation includes."
    }),
    ApiQuery({
      name: "where",
      required: false,
      schema: queryObjectSchema,
      description: "Prisma where object. Dotted query keys are expanded and primitive values are parsed."
    }),
    ApiQuery({
      name: "orderBy",
      required: false,
      schema: { oneOf: [{ type: "object" }, { type: "array" }, { type: "string" }] },
      description: "Prisma orderBy object or array."
    }),
    ApiQuery({
      name: "distinct",
      required: false,
      schema: { oneOf: [{ type: "string" }, { type: "array" }] },
      description: "Prisma distinct field or fields."
    }),
    ApiBadRequestResponse({
      description: "Invalid fields syntax, unknown fields, invalid include/select, or invalid query values."
    })
  ];
  if (options.pagination ?? true) {
    decorators.unshift(
      ApiQuery({
        name: "page",
        required: false,
        type: Number,
        description: "Current page number.",
        example: 1
      }),
      ApiQuery({
        name: "perPage",
        required: false,
        type: Number,
        description: "Number of items per page.",
        example: 10
      })
    );
  }
  return applyDecorators5(...decorators);
}

// src/decorators/responses/api-error-responses.decorator.ts
import { applyDecorators as applyDecorators6 } from "@nestjs/common";

// src/decorators/responses/error-responses/get-message-from-status-code.ts
import { HttpStatus } from "@nestjs/common";
function getMessageFromStatusCode(statusCode) {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return "Bad Request";
    case HttpStatus.UNAUTHORIZED:
      return "Unauthorized";
    case HttpStatus.FORBIDDEN:
      return "Forbidden";
    case HttpStatus.NOT_FOUND:
      return "Not Found";
    case HttpStatus.CONFLICT:
      return "Conflict";
    case HttpStatus.TOO_MANY_REQUESTS:
      return "Too Many Requests";
    case HttpStatus.INTERNAL_SERVER_ERROR:
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
    acc[index] = getExampleFromCode(statusCode, code);
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
import { HttpStatus as HttpStatus2 } from "@nestjs/common";
import {
  ApiBadRequestResponse as ApiBadRequestResponse2,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
function getStatusConfigs(options) {
  return [
    {
      status: HttpStatus2.BAD_REQUEST,
      codes: options.badRequestCodes,
      description: options.badRequestDescription,
      decorator: ApiBadRequestResponse2
    },
    {
      status: HttpStatus2.UNAUTHORIZED,
      codes: options.unauthorizedCodes,
      description: options.unauthorizedDescription,
      decorator: ApiUnauthorizedResponse
    },
    {
      status: HttpStatus2.FORBIDDEN,
      codes: options.forbiddenCodes,
      description: options.forbiddenDescription,
      decorator: ApiForbiddenResponse
    },
    {
      status: HttpStatus2.NOT_FOUND,
      codes: options.notFoundCodes,
      description: options.notFoundDescription,
      decorator: ApiNotFoundResponse
    },
    {
      status: HttpStatus2.CONFLICT,
      codes: options.conflictCodes,
      description: options.conflictDescription,
      decorator: ApiConflictResponse
    },
    {
      status: HttpStatus2.TOO_MANY_REQUESTS,
      codes: options.tooManyRequestsCodes,
      description: options.tooManyRequestsDescription,
      decorator: ApiTooManyRequestsResponse
    },
    {
      status: HttpStatus2.INTERNAL_SERVER_ERROR,
      codes: options.internalServerErrorCodes,
      description: options.internalServerErrorDescription ?? (options.internalServerError ? getMessageFromStatusCode(HttpStatus2.INTERNAL_SERVER_ERROR) : void 0),
      decorator: ApiInternalServerErrorResponse
    }
  ];
}

// src/decorators/responses/api-error-responses.decorator.ts
function ApiErrorResponses(options = {}) {
  const decorators = getStatusConfigs(options).filter((config) => config.codes || config.description).map((config) => config.decorator(getResponseDecoratorOptions(config.status, config.codes, config.description)));
  return applyDecorators6(...decorators);
}

// src/decorators/responses/api-paginated-response.decorator.ts
import { applyDecorators as applyDecorators7 } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
function ApiPaginatedResponse(options) {
  return applyDecorators7(
    ApiExtraModels(PaginatedDTO, PageMetaDTO, options.model),
    ApiOkResponse({
      ...options,
      description: options.description ?? "Paginated items",
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDTO) },
          {
            properties: {
              items: {
                type: "array",
                items: { $ref: getSchemaPath(options.model) }
              },
              meta: { $ref: getSchemaPath(PageMetaDTO) }
            }
          }
        ]
      }
    })
  );
}

export {
  ApiParamId,
  ApiPropertyCreatedAt,
  ApiPropertyId,
  ApiPropertyUpdatedAt,
  ApiResourceQuery,
  ApiErrorResponses,
  ApiPaginatedResponse
};
//# sourceMappingURL=chunk-QUR7P7JS.js.map
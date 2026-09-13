import { ApiPropertyOptions, ApiResponseOptions } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

type ApiParamIdOptions = {
    /** Name of the route parameter. Defaults to `id`. */
    name?: string;
    /** Optional description shown in the Swagger parameter schema. */
    description?: string;
};
/**
 * Adds a UUID route parameter to the Swagger schema.
 *
 * @param {ApiParamIdOptions} options Optional name and description overrides.
 * @returns {MethodDecorator} The composed Swagger parameter decorator.
 */
declare function ApiParamId(options?: ApiParamIdOptions): MethodDecorator;

/**
 * Adds a created-at date property to the Swagger schema.
 *
 * @param {ApiPropertyOptions} options Optional Swagger property overrides.
 * @returns {PropertyDecorator} The composed Swagger property decorator.
 */
declare function ApiPropertyCreatedAt(options?: ApiPropertyOptions): PropertyDecorator;

/**
 * Adds a UUID ID property to the Swagger schema.
 *
 * @param {ApiPropertyOptions} options Optional Swagger property overrides.
 * @returns {PropertyDecorator} The composed Swagger property decorator.
 */
declare function ApiPropertyId(options?: ApiPropertyOptions): PropertyDecorator;

/**
 * Adds an updated-at date property to the Swagger schema.
 *
 * @param {ApiPropertyOptions} options Optional Swagger property overrides.
 * @returns {PropertyDecorator} The composed Swagger property decorator.
 */
declare function ApiPropertyUpdatedAt(options?: ApiPropertyOptions): PropertyDecorator;

/**
 * Options for {@link ApiResourceQuery}.
 */
type ApiResourceQueryOptions = {
    /** Include `page` and `perPage` query parameters. */
    pagination?: boolean;
};
/**
 * Documents the common Query Kit resource query parameters.
 *
 * @param {ApiResourceQueryOptions} [options] Optional query metadata options.
 * @returns {MethodDecorator & ClassDecorator} A composed Swagger decorator.
 */
declare function ApiResourceQuery(options?: ApiResourceQueryOptions): MethodDecorator & ClassDecorator;

/**
 * Type representing an error code or a tuple of error code and custom message.
 */
type Code = string | [string, string];
/**
 * Options for ApiErrorResponses decorator.
 */
type ApiErrorResponsesOptions = {
    /** Error codes documented as Bad Request examples. */
    badRequestCodes?: Code[];
    /** Description used for the Bad Request response schema. */
    badRequestDescription?: string;
    /** Error codes documented as Unauthorized examples. */
    unauthorizedCodes?: Code[];
    /** Description used for the Unauthorized response schema. */
    unauthorizedDescription?: string;
    /** Error codes documented as Forbidden examples. */
    forbiddenCodes?: Code[];
    /** Description used for the Forbidden response schema. */
    forbiddenDescription?: string;
    /** Error codes documented as Not Found examples. */
    notFoundCodes?: Code[];
    /** Description used for the Not Found response schema. */
    notFoundDescription?: string;
    /** Error codes documented as Conflict examples. */
    conflictCodes?: Code[];
    /** Description used for the Conflict response schema. */
    conflictDescription?: string;
    /** Error codes documented as Too Many Requests examples. */
    tooManyRequestsCodes?: Code[];
    /** Description used for the Too Many Requests response schema. */
    tooManyRequestsDescription?: string;
    /** Includes a generic Internal Server Error response when set to `true`. */
    internalServerError?: boolean;
    /** Error codes documented as Internal Server Error examples. */
    internalServerErrorCodes?: Code[];
    /** Description used for the Internal Server Error response schema. */
    internalServerErrorDescription?: string;
};

/**
 * Decorator to define multiple error responses for a controller or method.
 *
 * @param {ApiErrorResponsesOptions} options Options to configure error responses.
 * @returns {MethodDecorator & ClassDecorator} The composed response decorator.
 */
declare function ApiErrorResponses(options?: ApiErrorResponsesOptions): MethodDecorator & ClassDecorator;

/**
 * Options for {@link ApiPaginatedResponse}.
 */
type ApiPaginatedResponseOptions<T> = Omit<ApiResponseOptions, 'schema' | 'type'> & {
    /** DTO class used as the item schema inside the paginated `items` array. */
    model: Type<T>;
};
/**
 * Adds a paginated response schema to a Swagger operation.
 *
 * @param options Response options.
 * @returns Composed Swagger decorator.
 */
declare function ApiPaginatedResponse<TModel>(options: ApiPaginatedResponseOptions<TModel>): MethodDecorator & ClassDecorator;

export { ApiErrorResponses, type ApiErrorResponsesOptions, ApiPaginatedResponse, type ApiPaginatedResponseOptions, ApiParamId, type ApiParamIdOptions, ApiPropertyCreatedAt, ApiPropertyId, ApiPropertyUpdatedAt, ApiResourceQuery, type ApiResourceQueryOptions, type Code };

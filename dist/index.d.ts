export { CHECK_POLICIES_KEY, CaslAccessibleWhereOptions, CaslDtoFilterOptions, CaslFieldAbility, CheckPolicies, PoliciesGuard, PolicyHandler, createCaslAccessibleWhere, filterCaslFields } from './casl.js';
export { ApiErrorResponses, ApiPaginatedResponse, ApiPaginatedResponseOptions, ApiParamId, ApiPropertyCreatedAt, ApiPropertyId, ApiPropertyUpdatedAt, ApiResourceQuery, ApiResourceQueryOptions } from './decorators.js';
export { AggregateDTO, BaseDelegate, BaseDelegateTypeMap, CountDTO, Delegate, DelegateTypeMap, FindByIdDTO, FindManyDTO, FindOneDTO, FindUniqueDTO, QueryDTO, QueryOptionsMap } from './dto.js';
import { SchemaOrDto, PrepareFieldsQueryOptions } from './fields.js';
export { ApiFieldsQuery, ApiFieldsQueryOptions, FieldSchema, FieldSchemaNode, Fields, FieldsBadRequestException, FieldsBadRequestResponse, FieldsExceptionFilter, FieldsParseOptions, FieldsParser, FieldsProjection, FieldsProjector, FieldsQuery, FieldsValidator, PreparedFieldsQuery, buildFieldSchemaFromDto, getDtoFields, prepareFieldsQuery, relation } from './fields.js';
export { P as PageMetaDTO } from './page-meta.dto-DUMBEnH5.js';
export { P as PageOptionsDTO } from './page-options.dto-DbbuIVqj.js';
import { PaginatedDTO } from './pagination.js';
export { Paginated } from './pagination.js';
export { EmptyStringToNullPipe, QueryTransformPipe } from './pipes.js';
export { A as AccessibleWhereResolver, Q as QueryServiceOptions } from './query-service.types-B4FRCOQf.js';
export { QueryService } from './query-service.js';
export { d as diffObjects, h as hasObjectDifferences, i as isBoolean, b as isNumber, c as isObject, e as isPlainObject, p as parseBoolean, f as parseObject, g as parseObjectProperties, s as serializeDecimalValues } from './parse-from-object-CzpcXT3S.js';
import { ValidationError } from 'class-validator';
import '@casl/ability';
import '@nestjs/common';
import '@nestjs/core';
import '@nestjs/swagger';

type ResourceQueryServiceLike<TAbility> = {
    query<T = unknown>(query: unknown, ability?: TAbility): Promise<{
        pageMeta: PageMetaLike;
        items: T[];
    }>;
    findById<T = unknown>(id: string, query?: unknown, ability?: TAbility): Promise<T>;
};
type PageMetaLike = ConstructorParameters<typeof PaginatedDTO<unknown>>[1];
type ResourceMapper<TModel, TDto, TAbility> = (model: TModel, ability?: TAbility) => TDto | Promise<TDto>;
/**
 * Options for {@link ResourceQuery.query}.
 */
type ResourceQueryOptions<TService, TQuery, TSchema extends SchemaOrDto, TModel, TDto, TAbility> = {
    /** Query-capable service, usually a QueryService subclass. */
    service: TService;
    /** Controller query DTO. */
    query: TQuery;
    /** Fields schema or Swagger DTO class. */
    schema: TSchema;
    /** Optional ability forwarded to the service and mapper. */
    ability?: TAbility;
    /** Include configuration required by the endpoint before client fields are applied. */
    include?: unknown;
    /** Maps service models to response DTOs. */
    map: ResourceMapper<TModel, TDto, TAbility>;
    /** Optional fields parsing and validation options. */
    fields?: PrepareFieldsQueryOptions;
};
/**
 * Options for {@link ResourceQuery.findById}.
 */
type ResourceFindByIdOptions<TService, TQuery, TSchema extends SchemaOrDto, TModel, TDto, TAbility> = ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility> & {
    /** Resource ID passed to the service. */
    id: string;
};

/**
 * High-level helpers for common resource controller query flows.
 */
declare class ResourceQuery {
    /**
     * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
     *
     * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
     * @returns {Promise<PaginatedDTO<TDto>>} Projected paginated response DTO.
     */
    static query<TService extends ResourceQueryServiceLike<TAbility>, TQuery extends {
        fields?: unknown;
        include?: unknown;
    }, TSchema extends SchemaOrDto, TModel, TDto, TAbility = unknown>(options: ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<PaginatedDTO<TDto>>;
    /**
     * Finds one resource by ID, maps it to a DTO and applies the requested fields projection.
     *
     * @param {ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Find options.
     * @returns {Promise<TDto>} Projected response DTO.
     */
    static findById<TService extends ResourceQueryServiceLike<TAbility>, TQuery extends {
        fields?: unknown;
        include?: unknown;
    }, TSchema extends SchemaOrDto, TModel, TDto, TAbility = unknown>(options: ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<TDto>;
}

/**
 * Parses query-like values into normalized JavaScript values.
 *
 * Delegates object parsing rules to `../object/index.js`.
 *
 * @param value Raw query value.
 * @returns Parsed query value.
 */
declare function parseQueryObject<T = unknown>(value: T): T;

/**
 * Description of a failed class-validator constraint.
 */
type ValidationErrorDescription = {
    /** Name of the failed validator. */
    name: string;
    /** Static constraint values configured for the validator. */
    constraints: string[];
};
/**
 * Nested validation error map keyed by property name.
 */
type ValidationPropertyErrors = {
    [property: string]: ValidationErrorDescription[] | ValidationPropertyErrors;
};
/**
 * Utility class for validation-related operations.
 */
declare class ValidationUtil {
    /**
     * Returns validation metadata for a specific validation error target.
     *
     * @param {ValidationError} error The validation error to inspect.
     * @returns {ValidationMetadata[]} The metadata entries for the error target.
     */
    private static getMetaData;
    /**
     * Processes constraints for a specific validation error.
     *
     * @param {ValidationError} error The error to process.
     * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
     * @returns {ValidationErrorDescription[]} The normalized constraint descriptions.
     */
    private static processConstraints;
    /**
     * Recursively processes child validation errors into a nested error map.
     *
     * @param {ValidationError[]} children The child errors to process.
     * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
     * @returns {ValidationPropertyErrors} The nested error structure.
     */
    private static processChildren;
    /**
     * Maps class-validator errors into a structured object representation.
     *
     * @param {ValidationError[]} errors The validation errors to map.
     * @returns {ValidationPropertyErrors} The mapped validation errors.
     */
    static mapValidationErrorsToObject(errors: ValidationError[]): ValidationPropertyErrors;
}

export { PaginatedDTO, PrepareFieldsQueryOptions, type ResourceFindByIdOptions, ResourceQuery, type ResourceQueryOptions, SchemaOrDto, type ValidationPropertyErrors, ValidationUtil, parseQueryObject };

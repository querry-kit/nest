export { CHECK_POLICIES_KEY, CaslAccessibleWhereOptions, CaslDtoFilterOptions, CaslFieldAbility, CheckPolicies, PoliciesGuard, PolicyHandler, createCaslAccessibleWhere, filterCaslFields } from './casl.cjs';
export { ApiErrorResponses, ApiPaginatedResponse, ApiPaginatedResponseOptions, ApiParamId, ApiPropertyCreatedAt, ApiPropertyId, ApiPropertyUpdatedAt, ApiResourceQuery, ApiResourceQueryOptions } from './decorators.cjs';
export { AggregateDTO, BaseDelegate, BaseDelegateTypeMap, CountDTO, Delegate, DelegateTypeMap, FindByIdDTO, FindManyDTO, FindOneDTO, FindUniqueDTO, QueryDTO, QueryOptionsMap } from './dto.cjs';
export { ApiFieldsQuery, ApiFieldsQueryOptions, FieldSchema, FieldSchemaNode, Fields, FieldsBadRequestException, FieldsBadRequestResponse, FieldsExceptionFilter, FieldsParseOptions, FieldsParser, FieldsProjection, FieldsProjector, FieldsQuery, FieldsValidator, PrepareFieldsQueryOptions, PreparedFieldsQuery, SchemaOrDto, buildFieldSchemaFromDto, getDtoFields, prepareFieldsQuery, relation } from './fields.cjs';
import { P as PageMetaDTO } from './page-meta.dto-Cjfnj1Kt.cjs';
export { P as PageOptionsDTO } from './page-options.dto-DbbuIVqj.cjs';
import { PaginatedDTO } from './pagination.cjs';
export { Paginated } from './pagination.cjs';
export { EmptyStringToNullPipe, QueryTransformPipe } from './pipes.cjs';
export { A as AccessibleWhereResolver, Q as QueryServiceOptions } from './query-service.types-B4FRCOQf.cjs';
export { QueryService } from './query-service.cjs';
import { a as ResourceQuery$1 } from './resource-query-CJa3V1E-.cjs';
export { R as ResourceFindByIdOptions, b as ResourceQueryOptions, p as parseQueryObject } from './resource-query-CJa3V1E-.cjs';
export { d as diffObjects, h as hasObjectDifferences, i as isBoolean, b as isNumber, c as isObject, e as isPlainObject, p as parseBoolean, f as parseObject, g as parseObjectProperties, s as serializeDecimalValues } from './parse-from-object-DSdt937G.cjs';
import { ValidationError } from 'class-validator';
import '@casl/ability';
import '@nestjs/common';
import '@nestjs/core';
import '@nestjs/swagger';
import './page-meta-BP4jzpd4.cjs';
import './query.service-nvP2BQry.cjs';

/** Resource helpers preserving decorated response DTOs for existing consumers. */
declare class ResourceQuery extends ResourceQuery$1 {
    /**
     * Creates the legacy decorated paginated response.
     *
     * @param {T[]} items Mapped and projected response items.
     * @param {PageMetaDTO} meta Pagination metadata from the service.
     * @returns {PaginatedDTO<T>} Decorated response envelope.
     */
    protected static createResponse<T>(items: T[], meta: PageMetaDTO): PaginatedDTO<T>;
}

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

export { PageMetaDTO, PaginatedDTO, ResourceQuery, type ValidationPropertyErrors, ValidationUtil };

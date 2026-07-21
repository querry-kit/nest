import { ApiQueryOptions, ApiResponseNoStatusOptions } from '@nestjs/swagger';
import { BadRequestException, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

/**
 * Options for `ApiFieldsQuery`.
 */
type ApiFieldsQueryOptions = {
    query?: Omit<ApiQueryOptions, 'name' | 'required' | 'type'>;
    badRequest?: ApiResponseNoStatusOptions;
};
/**
 * Documents the `fields` query parameter and its validation error response.
 *
 * @param {ApiFieldsQueryOptions} [options] Optional Swagger metadata overrides.
 * @returns {MethodDecorator & ClassDecorator} A composed Swagger decorator.
 */
declare function ApiFieldsQuery(options?: ApiFieldsQueryOptions): MethodDecorator & ClassDecorator;

/**
 * Structured response payload for invalid `fields` query parameters.
 */
type FieldsBadRequestResponse = {
    message: 'Invalid fields query parameter';
    details: string;
    path?: string;
    position?: number;
};

/**
 * Error thrown when a `fields` query parameter cannot be parsed or validated.
 */
declare class FieldsBadRequestException extends BadRequestException {
    /**
     * Creates a structured fields bad request error.
     *
     * @param {FieldsBadRequestResponse} response The response body details.
     */
    constructor(response: FieldsBadRequestResponse);
}

/**
 * Constructor type accepted by DTO schema helpers.
 */
type DtoClass = {
    new (...args: any[]): unknown;
};

/**
 * Parsed projection tree from the `fields` query parameter.
 *
 * A `true` node includes the full field value. A nested object includes only
 * the selected child fields.
 */
interface FieldsProjection {
    [key: string]: FieldsProjection | true;
}
/**
 * One allowed schema node for a field projection.
 */
type FieldSchemaNode = true | {
    relation: true;
    fields: FieldSchema;
};
/**
 * DTO schema used to validate `fields` projections.
 */
type FieldSchema = Record<string, FieldSchemaNode>;

/**
 * Returns DTO field names based on Swagger property metadata.
 *
 * @param {DtoClass} dtoClass The DTO class to inspect.
 * @returns {string[]} The Swagger-decorated DTO field names.
 */
declare function getDtoFields(dtoClass: DtoClass): string[];
/**
 * Builds a field schema from a Swagger-decorated DTO class.
 *
 * Nested DTO properties become relation fields. Recursive DTO references are
 * cut off with an empty nested schema.
 *
 * @param {DtoClass} dtoClass The DTO class to inspect.
 * @param {Set<DtoClass>} [visited] The internal recursion guard.
 * @returns {FieldSchema} The generated field schema.
 */
declare function buildFieldSchemaFromDto(dtoClass: DtoClass, visited?: Set<DtoClass>): FieldSchema;

/**
 * Validation options for `Fields.parseAndValidate`.
 */
type FieldsParseOptions = {
    allowNested?: boolean;
    include?: unknown;
    requireIncludeForRelations?: boolean;
};

/**
 * High-level facade to parse, validate, include and apply `fields` projections.
 */
declare class Fields {
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
    static include(projection: FieldsProjection, schema: FieldSchema, existing?: unknown): Record<string, unknown>;
    /**
     * Parses and validates a raw `fields` value.
     *
     * @param {unknown} rawFields The raw query parameter value.
     * @param {FieldSchema} schema The allowed DTO field schema.
     * @param {FieldsParseOptions} [options] The validation options.
     * @returns {FieldsProjection | undefined} The parsed projection, an empty projection for an explicit empty string, or `undefined` when omitted.
     * @throws {FieldsBadRequestException} If parsing or validation fails.
     */
    static parseAndValidate(rawFields: unknown, schema: FieldSchema, options?: FieldsParseOptions): FieldsProjection | undefined;
    /**
     * Applies a projection to a source value.
     *
     * @param {T} value The source value.
     * @param {FieldsProjection} [projection] The parsed projection tree.
     * @returns {T} The projected value.
     */
    static project<T>(value: T, projection?: FieldsProjection): T;
}

/**
 * Parses `fields` query parameter values.
 */
declare class FieldsParser {
    /**
     * Parses a `fields` value into a projection tree.
     *
     * @param {unknown} value The raw `fields` query parameter value.
     * @returns {FieldsProjection | undefined} The parsed projection tree, an empty projection for an explicit empty string, or `undefined` when omitted.
     * @throws {FieldsBadRequestException} If the value type or syntax is invalid.
     */
    static parse(value: unknown): FieldsProjection | undefined;
}

/**
 * Applies validated `fields` projections to objects and arrays.
 */
declare class FieldsProjector {
    /**
     * Projects any source value to the requested shape.
     *
     * @param {T} value The source value to project.
     * @param {FieldsProjection} [projection] The requested fields tree.
     * @returns {T} The projected value.
     */
    static project<T = unknown>(value: T, projection?: FieldsProjection): T;
    /**
     * Recursively projects one value.
     *
     * @param {unknown} value The current source value.
     * @param {FieldsProjection | true} projection The projection node.
     * @returns {unknown} The projected value for the current node.
     */
    private static projectInternal;
}

/**
 * Creates a relation schema node.
 *
 * @param {FieldSchema} fields The nested field schema for the relation.
 * @returns {FieldSchemaNode} The relation schema node.
 */
declare function createRelationSchemaNode(fields: FieldSchema): FieldSchemaNode;
/**
 * Creates a relation schema node.
 *
 * @param {FieldSchema} fields The nested field schema for the relation.
 * @returns {FieldSchemaNode} The relation schema node.
 */
declare function relation(fields: FieldSchema): FieldSchemaNode;

/**
 * Validates parsed field projections against DTO schemas and include rules.
 */
declare class FieldsValidator {
    /**
     * Validates field names and nesting against a schema.
     *
     * @param {FieldsProjection} projection The parsed fields projection.
     * @param {FieldSchema} schema The allowed DTO schema.
     * @param {string} [path] The internal traversal path.
     * @returns {void}
     * @throws {FieldsBadRequestException} If an unknown field or invalid nesting is used.
     */
    static validateProjection(projection: FieldsProjection, schema: FieldSchema, path?: string): void;
    /**
     * Ensures a projection only contains top-level fields.
     *
     * @param {FieldsProjection} projection The parsed fields projection.
     * @returns {void}
     * @throws {FieldsBadRequestException} If nested selections are present.
     */
    static validateNoNestedSelection(projection: FieldsProjection): void;
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
    static validateIncludeRequirements(projection: FieldsProjection, schema: FieldSchema, include: unknown, path?: string): void;
}

/**
 * Parses and validates the `fields` query parameter against a Swagger DTO.
 *
 * @param {DtoClass} dtoClass The Swagger-decorated DTO class used to build the field schema.
 * @param {FieldsParseOptions} [options] The validation options forwarded to `Fields.parseAndValidate`.
 * @returns {ParameterDecorator} A NestJS parameter decorator that resolves a fields projection.
 */
declare function FieldsQuery(dtoClass: DtoClass, options?: FieldsParseOptions): ParameterDecorator;

/**
 * Serializes invalid `fields` query parameter errors as HTTP 400 responses.
 */
declare class FieldsExceptionFilter implements ExceptionFilter<FieldsBadRequestException> {
    /**
     * Writes the fields error response through the active HTTP adapter response.
     *
     * @param {FieldsBadRequestException} exception The fields parser or validator exception.
     * @param {ArgumentsHost} host The Nest arguments host.
     * @returns {void}
     */
    catch(exception: FieldsBadRequestException, host: ArgumentsHost): void;
}

/**
 * Field schema source accepted by fields query helpers.
 */
type SchemaOrDto = FieldSchema | DtoClass;
/**
 * Options for fields query preparation.
 */
type PrepareFieldsQueryOptions = FieldsParseOptions & {
    /** Include configuration required by the endpoint before client fields are applied. */
    baseInclude?: unknown;
};
/**
 * Prepared query and parsed fields projection.
 */
type PreparedFieldsQuery<TQuery> = {
    /** Query copy with generated include data merged in when needed. */
    query: TQuery;
    /** Parsed projection, or `undefined` when no fields parameter was supplied. */
    projection: FieldsProjection | undefined;
};
type FieldsQueryLike = {
    fields?: unknown;
    include?: unknown;
};

/**
 * Parses `query.fields`, validates it against a schema or DTO and merges needed includes.
 *
 * @param {TQuery} query Controller query DTO or query-like object.
 * @param {SchemaOrDto} schemaOrDto Explicit field schema or Swagger DTO class.
 * @param {PrepareFieldsQueryOptions} [options] Fields parsing and validation options.
 * @returns {PreparedFieldsQuery<TQuery>} A non-mutating query copy and parsed projection.
 */
declare function prepareFieldsQuery<TQuery extends FieldsQueryLike>(query: TQuery, schemaOrDto: SchemaOrDto, options?: PrepareFieldsQueryOptions): PreparedFieldsQuery<TQuery>;
declare function resolveFieldSchema(schemaOrDto: SchemaOrDto): FieldSchema;

export { ApiFieldsQuery, type ApiFieldsQueryOptions, type FieldSchema, type FieldSchemaNode, Fields, FieldsBadRequestException, type FieldsBadRequestResponse, FieldsExceptionFilter, type FieldsParseOptions, FieldsParser, type FieldsProjection, FieldsProjector, FieldsQuery, FieldsValidator, type PrepareFieldsQueryOptions, type PreparedFieldsQuery, type SchemaOrDto, buildFieldSchemaFromDto, createRelationSchemaNode, getDtoFields, prepareFieldsQuery, relation, resolveFieldSchema };

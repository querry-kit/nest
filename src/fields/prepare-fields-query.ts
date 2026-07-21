import { buildFieldSchemaFromDto } from './core/dto-schema';
import { Fields } from './core/fields';
import { mergeInclude } from './core/include';
import type { DtoClass } from './types/dto-schema.types';
import type { FieldsParseOptions } from './types/fields.types';
import type { FieldSchema, FieldsProjection } from './types/schema.types';

/**
 * Field schema source accepted by fields query helpers.
 */
export type SchemaOrDto = FieldSchema | DtoClass;

/**
 * Options for {@link prepareFieldsQuery}.
 */
export type PrepareFieldsQueryOptions = FieldsParseOptions & {
  /** Include configuration required by the endpoint before client fields are applied. */
  baseInclude?: unknown;
};

/**
 * Prepared query and parsed fields projection.
 */
export type PreparedFieldsQuery<TQuery> = {
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
export function prepareFieldsQuery<TQuery extends FieldsQueryLike>(
  query: TQuery,
  schemaOrDto: SchemaOrDto,
  options?: PrepareFieldsQueryOptions,
): PreparedFieldsQuery<TQuery> {
  const schema = resolveFieldSchema(schemaOrDto);
  const mergedInclude = mergeInclude(options?.baseInclude, query.include);
  const projection = Fields.parseAndValidate(query.fields, schema, {
    ...options,
    include: options?.include ?? mergedInclude,
  });

  if (!projection) {
    return {
      query: {
        ...query,
        ...(typeof mergedInclude === 'undefined' ? {} : { include: mergedInclude }),
      },
      projection,
    };
  }

  return {
    query: {
      ...query,
      include: Fields.include(projection, schema, mergedInclude),
    },
    projection,
  };
}

export function resolveFieldSchema(schemaOrDto: SchemaOrDto): FieldSchema {
  if (typeof schemaOrDto === 'function') {
    return buildFieldSchemaFromDto(schemaOrDto);
  }

  return schemaOrDto;
}

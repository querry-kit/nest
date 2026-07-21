import { buildFieldSchemaFromDto } from './core/dto-schema';
import { Fields } from './core/fields';
import { mergeInclude } from './core/include';
import type {
  FieldsQueryLike,
  PreparedFieldsQuery,
  PrepareFieldsQueryOptions,
  SchemaOrDto,
} from './prepare-fields-query.types';
import type { FieldSchema } from './types/schema.types';

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

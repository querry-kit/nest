import { Fields } from './fields/core/fields';
import { mergeInclude } from './fields/core/include';
import {
  FieldsParser,
  prepareFieldsQuery,
  relation,
  resolveFieldSchema,
  type FieldSchema,
  type FieldsProjection,
  type PrepareFieldsQueryOptions,
  type SchemaOrDto,
} from './fields/index';

export type PaginatedPreparedQuery<TQuery> = {
  query: TQuery;
  itemProjection: FieldsProjection | undefined;
  responseProjection: FieldsProjection | undefined;
};

const pageMetaFieldSchema: FieldSchema = {
  page: true,
  perPage: true,
  itemCount: true,
  pageCount: true,
  hasPrevPage: true,
  hasNextPage: true,
};

export function preparePaginatedFieldsQuery<TQuery extends { fields?: unknown; include?: unknown }>(
  query: TQuery,
  schemaOrDto: SchemaOrDto,
  options?: PrepareFieldsQueryOptions,
): PaginatedPreparedQuery<TQuery> {
  const itemSchema = resolveFieldSchema(schemaOrDto);
  const responseSchema: FieldSchema = {
    items: relation(itemSchema),
    meta: relation(pageMetaFieldSchema),
  };
  const parsedProjection = FieldsParser.parse(query.fields);

  if (parsedProjection && hasPaginatedProjectionShape(parsedProjection)) {
    const responseProjection = Fields.parseAndValidate(query.fields, responseSchema, options)!;
    const itemProjection = getItemProjection(responseProjection);
    const include = itemProjection
      ? Fields.include(itemProjection, itemSchema, mergeInclude(options?.baseInclude, query.include))
      : mergeInclude(options?.baseInclude, query.include);

    return {
      query: {
        ...query,
        ...(typeof include === 'undefined' ? {} : { include }),
      },
      itemProjection,
      responseProjection,
    };
  }

  const prepared = prepareFieldsQuery(query, schemaOrDto, options);

  return {
    query: prepared.query,
    itemProjection: prepared.projection,
    responseProjection: undefined,
  };
}

function hasPaginatedProjectionShape(projection: FieldsProjection): boolean {
  return Object.keys(projection).some((key) => key === 'items' || key === 'meta');
}

function getItemProjection(projection: FieldsProjection): FieldsProjection | undefined {
  const items = projection.items;
  return items && items !== true ? items : undefined;
}

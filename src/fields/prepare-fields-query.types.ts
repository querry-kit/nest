import type { DtoClass } from './types/dto-schema.types';
import type { FieldsParseOptions } from './types/fields.types';
import type { FieldSchema, FieldsProjection } from './types/schema.types';

/**
 * Field schema source accepted by fields query helpers.
 */
export type SchemaOrDto = FieldSchema | DtoClass;

/**
 * Options for fields query preparation.
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

export type FieldsQueryLike = {
  fields?: unknown;
  include?: unknown;
};

import type { PrepareFieldsQueryOptions, SchemaOrDto } from './fields/index';
import type { PaginatedDTO } from './pagination/paginated.dto';

export type ResourceQueryServiceLike<TAbility> = {
  query<T = unknown>(query: unknown, ability?: TAbility): Promise<{ pageMeta: PageMetaLike; items: T[] }>;
  findById<T = unknown>(id: string, query?: unknown, ability?: TAbility): Promise<T>;
};

export type PageMetaLike = ConstructorParameters<typeof PaginatedDTO<unknown>>[1];

export type ResourceMapper<TModel, TDto, TAbility> = (model: TModel, ability?: TAbility) => TDto | Promise<TDto>;

/**
 * Options for {@link ResourceQuery.query}.
 */
export type ResourceQueryOptions<TService, TQuery, TSchema extends SchemaOrDto, TModel, TDto, TAbility> = {
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
export type ResourceFindByIdOptions<
  TService,
  TQuery,
  TSchema extends SchemaOrDto,
  TModel,
  TDto,
  TAbility,
> = ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility> & {
  /** Resource ID passed to the service. */
  id: string;
};

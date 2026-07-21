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
import { PaginatedDTO } from './pagination/paginated.dto';

type QueryServiceLike<TAbility> = {
  query<T = unknown>(query: unknown, ability?: TAbility): Promise<{ pageMeta: PageMetaLike; items: T[] }>;
  findById<T = unknown>(id: string, query?: unknown, ability?: TAbility): Promise<T>;
};

type PageMetaLike = ConstructorParameters<typeof PaginatedDTO<unknown>>[1];

type Mapper<TModel, TDto, TAbility> = (model: TModel, ability?: TAbility) => TDto | Promise<TDto>;

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
  map: Mapper<TModel, TDto, TAbility>;
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

/**
 * High-level helpers for common resource controller query flows.
 */
export class ResourceQuery {
  /**
   * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
   *
   * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
   * @returns {Promise<PaginatedDTO<TDto>>} Projected paginated response DTO.
   */
  static async query<
    TService extends QueryServiceLike<TAbility>,
    TQuery extends { fields?: unknown; include?: unknown },
    TSchema extends SchemaOrDto,
    TModel,
    TDto,
    TAbility = unknown,
  >(options: ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<PaginatedDTO<TDto>> {
    const prepared = preparePaginatedFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude,
    });
    const result = await options.service.query<TModel>(prepared.query, options.ability);
    const dtoItems = await Promise.all(result.items.map((item) => options.map(item, options.ability)));
    const response = new PaginatedDTO(dtoItems, result.pageMeta);

    if (prepared.responseProjection) {
      return Fields.project(response, prepared.responseProjection);
    }

    return new PaginatedDTO(Fields.project(dtoItems, prepared.itemProjection), result.pageMeta);
  }

  /**
   * Finds one resource by ID, maps it to a DTO and applies the requested fields projection.
   *
   * @param {ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Find options.
   * @returns {Promise<TDto>} Projected response DTO.
   */
  static async findById<
    TService extends QueryServiceLike<TAbility>,
    TQuery extends { fields?: unknown; include?: unknown },
    TSchema extends SchemaOrDto,
    TModel,
    TDto,
    TAbility = unknown,
  >(options: ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<TDto> {
    const prepared = prepareFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude,
    });
    const model = await options.service.findById<TModel>(options.id, prepared.query, options.ability);
    const dto = await options.map(model, options.ability);

    return Fields.project(dto, prepared.projection);
  }
}

type PaginatedPreparedQuery<TQuery> = {
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

function preparePaginatedFieldsQuery<TQuery extends { fields?: unknown; include?: unknown }>(
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

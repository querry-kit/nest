import { SchemaOrDto, PrepareFieldsQueryOptions } from './fields.cjs';
import { P as PageMeta } from './page-meta-BP4jzpd4.cjs';

type ResourceQueryServiceLike<TAbility> = {
    query<T = unknown>(query: unknown, ability?: TAbility): Promise<{
        pageMeta: PageMetaLike;
        items: T[];
    }>;
    findById<T = unknown>(id: string, query?: unknown, ability?: TAbility): Promise<T>;
};
type PageMetaLike = PageMeta;
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
 * Parses query-like values into normalized JavaScript values.
 *
 * Delegates object parsing rules to `../object/index.js`.
 *
 * @param value Raw query value.
 * @returns Parsed query value.
 */
declare function parseQueryObject<T = unknown>(value: T): T;

/** Public paginated response envelope without decorated DTO classes. */
type PaginatedResponse<T> = {
    readonly items: T[];
    readonly meta: PageMeta;
};

/**
 * High-level helpers for common resource controller query flows.
 */
declare class ResourceQuery {
    /**
     * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
     *
     * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
     * @returns {Promise<PaginatedResponse<TDto>>} Projected paginated response DTO.
     */
    static query<TService extends ResourceQueryServiceLike<TAbility>, TQuery extends {
        fields?: unknown;
        include?: unknown;
    }, TSchema extends SchemaOrDto, TModel, TDto, TAbility = unknown>(options: ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<PaginatedResponse<TDto>>;
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
    /**
     * Creates a plain paginated response without serialization decorators.
     *
     * @param {T[]} items Mapped and projected response items.
     * @param {PageMeta} meta Pagination metadata from the service.
     * @returns {PaginatedResponse<T>} Public response envelope.
     */
    protected static createResponse<T>(items: T[], meta: PageMeta): PaginatedResponse<T>;
}

export { type PaginatedResponse as P, type ResourceFindByIdOptions as R, ResourceQuery as a, type ResourceQueryOptions as b, parseQueryObject as p };

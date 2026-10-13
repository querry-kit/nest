import { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from './dto.cjs';
import { Q as QueryServiceOptions } from './query-service.types-B4FRCOQf.cjs';
import { P as PageMeta, a as PageMetaParams } from './page-meta-BP4jzpd4.cjs';

/**
 * Generic query service for Prisma-compatible delegates.
 */
declare class QueryService<DelegateType extends BaseDelegate = BaseDelegate, TypeMap extends BaseDelegateTypeMap = BaseDelegateTypeMap, Table extends Delegate<DelegateType> = Delegate<DelegateType>, Options extends QueryOptionsMap<TypeMap> = QueryOptionsMap<TypeMap>, Ability = unknown, Subject = unknown> {
    protected readonly table: Table;
    protected readonly serviceOptions: QueryServiceOptions<Ability, Subject>;
    /**
     * Creates a query service.
     *
     * @param {Table} table Prisma-compatible delegate.
     * @param {QueryServiceOptions<Ability, Subject>} serviceOptions Query service options.
     */
    constructor(table: Table, serviceOptions?: QueryServiceOptions<Ability, Subject>);
    /**
     * Finds the first item matching query options.
     *
     * @param {Options['findOne']} options Query options.
     * @param {Ability} ability Optional access-control ability.
     * @returns {Promise<T | null>} Found item or null.
     */
    findOne<T = unknown>(options: Options['findOne'], ability?: Ability): Promise<T | null>;
    /**
     * Finds all items matching query options.
     *
     * @param {Options['findMany']} options Query options.
     * @param {Ability} ability Optional access-control ability.
     * @returns {Promise<T[]>} Found items.
     */
    findMany<T = unknown>(options?: Options['findMany'], ability?: Ability): Promise<T[]>;
    /**
     * Finds an item by ID.
     *
     * @param {string} id Item ID.
     * @param {Options['findById']} options Query options.
     * @param {Ability} ability Optional access-control ability.
     * @returns {Promise<T>} Found item.
     * @throws NotFoundException when no item exists.
     */
    findById<T = unknown>(id: string, options?: Options['findById'], ability?: Ability): Promise<T>;
    /**
     * Finds an item by a unique where input.
     *
     * @param {Options['findUnique']} options Query options.
     * @param {Ability} ability Optional access-control ability.
     * @returns {Promise<T>} Found item.
     * @throws NotFoundException when no item exists.
     */
    findUnique<T = unknown>(options: Options['findUnique'], ability?: Ability): Promise<T>;
    /**
     * Runs an aggregate query.
     *
     * @param {Options['aggregate']} options Aggregate options.
     * @returns {Promise<unknown>} Serialized aggregate result.
     */
    aggregate(options: Options['aggregate']): Promise<unknown>;
    /**
     * Counts items matching query options.
     *
     * @param {Options['count']} options Count options.
     * @param {Ability} ability Optional access-control ability.
     * @returns {Promise<number>} Item count.
     */
    count(options: Options['count'], ability?: Ability): Promise<number>;
    /**
     * Runs a paginated query.
     *
     * @param {Options['query']} options Query options.
     * @param {Ability} ability Optional access-control ability.
     * @returns {Promise<{ pageMeta: PageMeta; items: T[] }>} Paginated result.
     */
    query<T = unknown>(options: Options['query'], ability?: Ability): Promise<{
        pageMeta: PageMeta;
        items: T[];
    }>;
    /**
     * Creates pagination metadata without class-transformer decorators.
     *
     * @param {PageMetaParams} params Pagination options and item count.
     * @returns {PageMeta} Computed pagination metadata.
     */
    protected createPageMeta(params: PageMetaParams): PageMeta;
    /**
     * Combines a where input with an access-control where input when available.
     *
     * @param {unknown} where Query where object.
     * @param {Ability} ability Optional access-control ability.
     * @returns {unknown} Merged where object.
     */
    protected mergeAbilityWhere(where: unknown, ability?: Ability): unknown;
    /**
     * Converts Prisma-like errors to Nest HTTP exceptions.
     *
     * @param {unknown} error Error thrown by a delegate.
     * @param {unknown} options Original options.
     * @param {unknown} args Parsed delegate args.
     * @throws Converted Nest HTTP exception.
     */
    protected handleError(error: unknown, options?: unknown, args?: unknown): never;
}

export { QueryService as Q };

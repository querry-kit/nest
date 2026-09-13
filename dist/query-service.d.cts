import { Q as QueryServiceOptions } from './query-service.types-B4FRCOQf.cjs';
export { A as AccessibleWhereResolver } from './query-service.types-B4FRCOQf.cjs';
import { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from './dto.cjs';
import { P as PageMetaDTO } from './page-meta.dto-DYUXcvmU.cjs';
import './page-options.dto-DbbuIVqj.cjs';

/**
 * Generic query service for Prisma-compatible delegates.
 */
declare class QueryService<DelegateType extends BaseDelegate = BaseDelegate, TypeMap extends BaseDelegateTypeMap = BaseDelegateTypeMap, Table extends Delegate<DelegateType> = Delegate<DelegateType>, Options extends QueryOptionsMap<TypeMap> = QueryOptionsMap<TypeMap>, Ability = unknown, Subject = unknown> {
    protected readonly table: Table;
    protected readonly serviceOptions: QueryServiceOptions<Ability, Subject>;
    /**
     * Creates a query service.
     *
     * @param table Prisma-compatible delegate.
     * @param serviceOptions Query service options.
     */
    constructor(table: Table, serviceOptions?: QueryServiceOptions<Ability, Subject>);
    /**
     * Finds the first item matching query options.
     *
     * @param options Query options.
     * @param ability Optional access-control ability.
     * @returns Found item or null.
     */
    findOne<T = unknown>(options: Options['findOne'], ability?: Ability): Promise<T | null>;
    /**
     * Finds all items matching query options.
     *
     * @param options Query options.
     * @param ability Optional access-control ability.
     * @returns Found items.
     */
    findMany<T = unknown>(options?: Options['findMany'], ability?: Ability): Promise<T[]>;
    /**
     * Finds an item by ID.
     *
     * @param id Item ID.
     * @param options Query options.
     * @param ability Optional access-control ability.
     * @returns Found item.
     * @throws NotFoundException when no item exists.
     */
    findById<T = unknown>(id: string, options?: Options['findById'], ability?: Ability): Promise<T>;
    /**
     * Finds an item by a unique where input.
     *
     * @param options Query options.
     * @param ability Optional access-control ability.
     * @returns Found item.
     * @throws NotFoundException when no item exists.
     */
    findUnique<T = unknown>(options: Options['findUnique'], ability?: Ability): Promise<T>;
    /**
     * Runs an aggregate query.
     *
     * @param options Aggregate options.
     * @returns Serialized aggregate result.
     */
    aggregate(options: Options['aggregate']): Promise<unknown>;
    /**
     * Counts items matching query options.
     *
     * @param options Count options.
     * @param ability Optional access-control ability.
     * @returns Item count.
     */
    count(options: Options['count'], ability?: Ability): Promise<number>;
    /**
     * Runs a paginated query.
     *
     * @param options Query options.
     * @param ability Optional access-control ability.
     * @returns Paginated result.
     */
    query<T = unknown>(options: Options['query'], ability?: Ability): Promise<{
        pageMeta: PageMetaDTO;
        items: T[];
    }>;
    /**
     * Combines a where input with an access-control where input when available.
     *
     * @param where Query where object.
     * @param ability Optional access-control ability.
     * @returns Merged where object.
     */
    protected mergeAbilityWhere(where: unknown, ability?: Ability): unknown;
    /**
     * Converts Prisma-like errors to Nest HTTP exceptions.
     *
     * @param error Error thrown by a delegate.
     * @param options Original options.
     * @param args Parsed delegate args.
     * @throws Converted Nest HTTP exception.
     */
    protected handleError(error: unknown, options?: unknown, args?: unknown): never;
}

export { QueryService, QueryServiceOptions };

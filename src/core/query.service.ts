import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';

import type {
  BaseDelegate,
  BaseDelegateTypeMap,
  Delegate,
  GroupByDTO,
  GroupByDelegate,
  QueryOptionsMap,
} from '../dto/index.js';
import { handleQueryServiceError } from '../query-service/errors/handle-query-service-error.js';
import { isForbiddenLike } from '../query-service/errors/is-forbidden-like.js';
import type { QueryServiceOptions } from '../query-service/query-service.types.js';
import { serializeDecimalValues } from '../util/object/decimal.js';
import { parseQueryObject } from '../util/query/parse-query-object.js';
import { PageMeta, type PageMetaParams } from './page-meta.js';

/**
 * Generic query service for Prisma-compatible delegates.
 */
@Injectable()
export class QueryService<
  DelegateType extends BaseDelegate = BaseDelegate,
  TypeMap extends BaseDelegateTypeMap = BaseDelegateTypeMap,
  Table extends Delegate<DelegateType> = Delegate<DelegateType>,
  Options extends QueryOptionsMap<TypeMap> = QueryOptionsMap<TypeMap>,
  Ability = unknown,
  Subject = unknown,
> {
  /**
   * Creates a query service.
   *
   * @param {Table} table Prisma-compatible delegate.
   * @param {QueryServiceOptions<Ability, Subject>} serviceOptions Query service options.
   */
  constructor(
    protected readonly table: Table,
    protected readonly serviceOptions: QueryServiceOptions<Ability, Subject> = {},
  ) {}

  /**
   * Finds the first item matching query options.
   *
   * @param {Options['findOne']} options Query options.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<T | null>} Found item or null.
   */
  async findOne<T = unknown>(options: Options['findOne'], ability?: Ability): Promise<T | null> {
    const args: Parameters<DelegateType['findFirst']>[0] = {
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
      where: this.mergeAbilityWhere(options.where, ability),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
      distinct: parseQueryObject(options.distinct),
    };

    try {
      return (await this.table.findFirst(args)) as T | null;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }

  /**
   * Finds all items matching query options.
   *
   * @param {Options['findMany']} options Query options.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<T[]>} Found items.
   */
  async findMany<T = unknown>(
    options: Options['findMany'] = {} as Options['findMany'],
    ability?: Ability,
  ): Promise<T[]> {
    const args: Parameters<DelegateType['findMany']>[0] = {
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
      where: this.mergeAbilityWhere(options.where, ability),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
      take: options.take,
      skip: options.skip,
      distinct: parseQueryObject(options.distinct),
    };

    try {
      return (await this.table.findMany(args)) as T[];
    } catch (error) {
      this.handleError(error, options, args);
    }
  }

  /**
   * Finds an item by ID.
   *
   * @param {string} id Item ID.
   * @param {Options['findById']} options Query options.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<T>} Found item.
   * @throws NotFoundException when no item exists.
   */
  async findById<T = unknown>(
    id: string,
    options: Options['findById'] = {} as Options['findById'],
    ability?: Ability,
  ): Promise<T> {
    const args: Parameters<DelegateType['findFirst']>[0] = {
      where: this.mergeAbilityWhere({ id }, ability),
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
    };

    try {
      const item = await this.table.findFirst(args);
      if (!item) {
        throw new NotFoundException('Item not found.');
      }

      return item as T;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }

  /**
   * Finds an item by a unique where input.
   *
   * @param {Options['findUnique']} options Query options.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<T>} Found item.
   * @throws NotFoundException when no item exists.
   */
  async findUnique<T = unknown>(options: Options['findUnique'], ability?: Ability): Promise<T> {
    const args = {
      where: parseQueryObject(options.where),
      select: parseQueryObject(options.select),
      include: parseQueryObject(options.include),
    };

    try {
      const item = ability
        ? await this.table.findFirst({
            ...args,
            where: this.mergeAbilityWhere(options.where, ability),
          } as Parameters<DelegateType['findFirst']>[0])
        : await this.table.findUnique(args as Parameters<DelegateType['findUnique']>[0]);

      if (!item) {
        throw new NotFoundException('Item not found.');
      }

      return item as T;
    } catch (error) {
      this.handleError(error, options, args);
    }
  }

  /**
   * Runs an aggregate query.
   *
   * @param {Options['aggregate']} options Aggregate options.
   * @returns {Promise<unknown>} Serialized aggregate result.
   */
  async aggregate(options: Options['aggregate']): Promise<unknown> {
    const args: Parameters<DelegateType['aggregate']>[0] = {
      ...options,
      where: parseQueryObject(options.where),
      orderBy: parseQueryObject(options.orderBy),
      cursor: parseQueryObject(options.cursor),
    };

    const cleanedArgs = Object.fromEntries(
      Object.entries(args as Record<string, unknown>).filter(([, value]) => value !== undefined),
    );

    return serializeDecimalValues(await this.table.aggregate(cleanedArgs));
  }

  /**
   * Groups scalar fields with access-constrained aggregate results.
   *
   * @param {GroupByDTO<TypeMap>} options Group keys, filters, aggregates and pagination.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<T[]>} Group rows with Decimal-like values serialized.
   */
  async groupBy<T = unknown>(options: GroupByDTO<TypeMap>, ability?: Ability): Promise<T[]> {
    const args: Record<string, unknown> = {};
    try {
      const allowed = ['by', 'where', 'having', 'orderBy', 'take', 'skip', '_count', '_sum', '_avg', '_min', '_max'];
      if (!options || Object.keys(options).some((key) => !allowed.includes(key))) {
        throw new BadRequestException('Invalid group-by options.');
      }
      if (
        !Array.isArray(options.by) ||
        !options.by.length ||
        options.by.some((field) => typeof field !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(field)) ||
        new Set(options.by).size !== options.by.length
      ) {
        throw new BadRequestException('by must contain unique scalar field names.');
      }
      for (const key of ['take', 'skip'] as const) {
        const value = options[key];
        if (value !== undefined && (!Number.isInteger(value) || value < (key === 'take' ? 1 : 0))) {
          throw new BadRequestException('Invalid group pagination.');
        }
      }
      if ((options.take !== undefined || options.skip !== undefined) && !options.orderBy) {
        throw new BadRequestException('orderBy is required with take or skip.');
      }
      for (const key of allowed) {
        const value = options[key as keyof typeof options];
        if (value !== undefined) args[key] = key === 'by' ? value : parseQueryObject(value);
      }
      args.where = this.mergeAbilityWhere(options.where, ability);
      const delegate = this.table as Table & Partial<GroupByDelegate>;
      if (typeof delegate.groupBy !== 'function') {
        throw new NotImplementedException('Delegate does not support groupBy.');
      }
      return serializeDecimalValues(await delegate.groupBy(args)) as T[];
    } catch (error) {
      if (isForbiddenLike(error)) throw new ForbiddenException('Insufficient permissions.');
      this.handleError(error, options, args);
    }
  }

  /**
   * Counts items matching query options.
   *
   * @param {Options['count']} options Count options.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<number>} Item count.
   */
  async count(options: Options['count'], ability?: Ability): Promise<number> {
    const args: Parameters<DelegateType['count']>[0] = {
      where: this.mergeAbilityWhere(options.where, ability),
    };

    return (await this.table.count(args)) as number;
  }

  /**
   * Runs a paginated query.
   *
   * @param {Options['query']} options Query options.
   * @param {Ability} ability Optional access-control ability.
   * @returns {Promise<{ pageMeta: PageMeta; items: T[] }>} Paginated result.
   */
  async query<T = unknown>(options: Options['query'], ability?: Ability): Promise<{ pageMeta: PageMeta; items: T[] }> {
    try {
      const page = options.page ?? 1;
      const perPage = options.perPage ?? 10;
      const skip = (page - 1) * perPage;
      const where = this.mergeAbilityWhere(options.where, ability);
      const itemCount = await this.count({ where } as Options['count']);
      const items = await this.findMany<T>({ ...options, take: perPage, skip, where } as Options['findMany']);
      const pageMeta = this.createPageMeta({ itemCount, pageOptions: { page, perPage } });

      return { pageMeta, items };
    } catch (error) {
      if (isForbiddenLike(error)) {
        throw new ForbiddenException('Insufficient permissions.');
      }

      throw error;
    }
  }

  /**
   * Creates pagination metadata without class-transformer decorators.
   *
   * @param {PageMetaParams} params Pagination options and item count.
   * @returns {PageMeta} Computed pagination metadata.
   */
  protected createPageMeta(params: PageMetaParams): PageMeta {
    return new PageMeta(params);
  }

  /**
   * Combines a where input with an access-control where input when available.
   *
   * @param {unknown} where Query where object.
   * @param {Ability} ability Optional access-control ability.
   * @returns {unknown} Merged where object.
   */
  protected mergeAbilityWhere(where: unknown, ability?: Ability): unknown {
    let parsedWhere: unknown;
    if (this.serviceOptions.preserveJsonWhereTypes && typeof where === 'string') {
      try {
        parsedWhere = JSON.parse(where) as unknown;
      } catch {
        throw new BadRequestException('where must contain valid JSON.');
      }
      if (!parsedWhere || typeof parsedWhere !== 'object' || Array.isArray(parsedWhere)) {
        throw new BadRequestException('where must be an object.');
      }
    } else {
      parsedWhere = parseQueryObject(where ?? {});
    }

    if (!ability || !this.serviceOptions.accessibleWhere || this.serviceOptions.subject === undefined) {
      return parsedWhere;
    }

    return {
      AND: [this.serviceOptions.accessibleWhere(ability, this.serviceOptions.subject), parsedWhere],
    };
  }

  /**
   * Converts Prisma-like errors to Nest HTTP exceptions.
   *
   * @param {unknown} error Error thrown by a delegate.
   * @param {unknown} options Original options.
   * @param {unknown} args Parsed delegate args.
   * @throws Converted Nest HTTP exception.
   */
  protected handleError(error: unknown, options?: unknown, args?: unknown): never {
    handleQueryServiceError(error, options, args, this.serviceOptions.errorLogger);
  }
}

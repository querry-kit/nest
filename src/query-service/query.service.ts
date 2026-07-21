import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from '../dto/index.js';
import { PageMetaDTO } from '../pagination/page-meta.dto.js';
import { serializeDecimalValues } from '../prisma-utils/decimal.js';
import { parseQueryObject } from '../prisma-utils/object.js';

/**
 * Resolves an access-control where clause for a subject.
 *
 * The returned value is merged with caller-provided filters as
 * `{ AND: [accessibleWhere, parsedWhere] }`.
 *
 * @param ability Application ability object.
 * @param subject Subject configured on the query service.
 * @returns Prisma-compatible where input limiting accessible records.
 */
export type AccessibleWhereResolver<TAbility = unknown, TSubject = unknown> = (
  ability: TAbility,
  subject: TSubject,
) => unknown;

/**
 * Options accepted by {@link QueryService}.
 */
export type QueryServiceOptions<TAbility = unknown, TSubject = unknown> = {
  /** Subject passed to `accessibleWhere`, for example a CASL Prisma subject name. */
  subject?: TSubject;
  /** Optional resolver returning a Prisma-compatible access-control where input. */
  accessibleWhere?: AccessibleWhereResolver<TAbility, TSubject>;
  /** Optional logger for unexpected delegate errors before they are masked as 500 responses. */
  errorLogger?: Pick<Console, 'error'>;
};

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
   * @param table Prisma-compatible delegate.
   * @param serviceOptions Query service options.
   */
  constructor(
    protected readonly table: Table,
    protected readonly serviceOptions: QueryServiceOptions<Ability, Subject> = {},
  ) {}

  /**
   * Finds the first item matching query options.
   *
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item or null.
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
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found items.
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
   * @param id Item ID.
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item.
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
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Found item.
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
   * @param options Aggregate options.
   * @returns Serialized aggregate result.
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
   * Counts items matching query options.
   *
   * @param options Count options.
   * @param ability Optional access-control ability.
   * @returns Item count.
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
   * @param options Query options.
   * @param ability Optional access-control ability.
   * @returns Paginated result.
   */
  async query<T = unknown>(
    options: Options['query'],
    ability?: Ability,
  ): Promise<{ pageMeta: PageMetaDTO; items: T[] }> {
    try {
      const page = options.page ?? 1;
      const perPage = options.perPage ?? 10;
      const skip = (page - 1) * perPage;
      const where = this.mergeAbilityWhere(options.where, ability);
      const itemCount = await this.count({ where } as Options['count']);
      const items = await this.findMany<T>({ ...options, take: perPage, skip, where } as Options['findMany']);
      const pageMeta = new PageMetaDTO({ itemCount, pageOptions: { page, perPage } });

      return { pageMeta, items };
    } catch (error) {
      if (isForbiddenLike(error)) {
        throw new ForbiddenException('Insufficient permissions.');
      }

      throw error;
    }
  }

  /**
   * Combines a where input with an access-control where input when available.
   *
   * @param where Query where object.
   * @param ability Optional access-control ability.
   * @returns Merged where object.
   */
  protected mergeAbilityWhere(where: unknown, ability?: Ability): unknown {
    const parsedWhere = parseQueryObject(where ?? {});

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
   * @param error Error thrown by a delegate.
   * @param options Original options.
   * @param args Parsed delegate args.
   * @throws Converted Nest HTTP exception.
   */
  protected handleError(error: unknown, options?: unknown, args?: unknown): never {
    if (isValidationErrorLike(error)) {
      throw new BadRequestException({ message: 'Invalid query.', options, parsedArgs: args });
    }

    if (isKnownRequestErrorLike(error)) {
      throw new BadRequestException({
        message: error.message.split('\n\n\n')[1] ?? 'Invalid data',
        code: error.code,
        data: error.meta,
      });
    }

    if (error instanceof HttpException) {
      throw error;
    }

    this.serviceOptions.errorLogger?.error(error);
    throw new InternalServerErrorException();
  }
}

function isValidationErrorLike(error: unknown): boolean {
  return error instanceof Error && error.name === 'PrismaClientValidationError';
}

function isKnownRequestErrorLike(error: unknown): error is Error & { code: string; meta?: unknown } {
  return error instanceof Error && typeof (error as { code?: unknown }).code === 'string';
}

function isForbiddenLike(error: unknown): boolean {
  return error instanceof Error && (error.name === 'ForbiddenError' || error.name === 'ForbiddenErrorType');
}

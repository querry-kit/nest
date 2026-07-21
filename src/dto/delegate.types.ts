/**
 * Base delegate type-map used to type Prisma-like delegates without importing Prisma.
 *
 * Extend this interface with generated Prisma model types in application code.
 */
export interface BaseDelegateTypeMap {
  /** Prisma `ModelSelect` type. */
  select: unknown;
  /** Prisma `ModelInclude` type. */
  include: unknown;
  /** Prisma `ModelWhereInput` type. */
  whereInput: unknown;
  /** Prisma `ModelOrderByWithRelationInput` type. */
  orderByWithRelationInput: unknown;
  /** Prisma `ModelWhereUniqueInput` type. */
  whereUniqueInput: unknown;
  /** Prisma `ModelScalarFieldEnum` type. */
  scalarFieldEnum: unknown;
  /** Prisma checked create input type. Reserved for future write DTOs. */
  createInput: unknown;
  /** Prisma unchecked create input type. Reserved for future write DTOs. */
  uncheckedCreateInput: unknown;
  /** Prisma checked update-many input type. Reserved for future write DTOs. */
  updateManyMutationInput: unknown;
  /** Prisma unchecked update-many input type. Reserved for future write DTOs. */
  uncheckedUpdateManyInput: unknown;
  /** Prisma checked update input type. Reserved for future write DTOs. */
  updateInput: unknown;
  /** Prisma unchecked update input type. Reserved for future write DTOs. */
  uncheckedUpdateInput: unknown;
  /** Prisma aggregate input type containing aggregate selector fields. */
  aggregateInputType: {
    /** Prisma `_count` aggregate selector. */
    _count?: unknown;
    /** Prisma `_min` aggregate selector. */
    _min?: unknown;
    /** Prisma `_max` aggregate selector. */
    _max?: unknown;
    /** Prisma `_avg` aggregate selector. */
    _avg?: unknown;
    /** Prisma `_sum` aggregate selector. */
    _sum?: unknown;
  };
}

/**
 * Normalized delegate option type-map.
 *
 * This map adapts Prisma's generated names to the stable names used by the
 * query DTOs and {@link QueryService}.
 */
export interface DelegateTypeMap<T extends BaseDelegateTypeMap> {
  /** Select object accepted by the delegate. */
  select: T['select'];
  /** Include object accepted by the delegate. */
  include: T['include'];
  /** Where object accepted by `findMany`, `findFirst`, `count`, and `aggregate`. */
  where: T['whereInput'];
  /** Order input accepted by list and aggregate operations. */
  orderBy: T['orderByWithRelationInput'] | T['orderByWithRelationInput'][];
  /** Cursor input accepted by list and aggregate operations. */
  cursor: T['whereUniqueInput'];
  /** Distinct scalar field selector accepted by list operations. */
  distinct: T['scalarFieldEnum'];
  /** Create payload type reserved for future write DTOs. */
  createData: T['createInput'] | T['uncheckedCreateInput'];
  /** Update-many payload type reserved for future write DTOs. */
  updateManyData: T['updateManyMutationInput'] | T['uncheckedUpdateManyInput'];
  /** Update payload type reserved for future write DTOs. */
  updateData: T['updateInput'] | T['uncheckedUpdateInput'];
  /** Aggregate selector map accepted by aggregate operations. */
  aggregate: T['aggregateInputType'];
}

/**
 * Minimal Prisma-like delegate contract.
 *
 * Concrete Prisma delegates satisfy this shape. Test doubles and in-memory
 * examples can implement the same methods without importing Prisma.
 */
export interface BaseDelegate {
  create(args: unknown): unknown;
  findMany(args: unknown): unknown;
  updateMany(args: unknown): unknown;
  update(args: unknown): unknown;
  upsert(args: unknown): unknown;
  deleteMany(args: unknown): unknown;
  delete(args: unknown): unknown;
  findFirst(args: unknown): unknown;
  findUnique(args: unknown): unknown;
  aggregate(args: unknown): unknown;
  count(args: unknown): unknown;
}

/**
 * Delegate preserving argument and return types of a concrete Prisma-like delegate.
 */
export interface Delegate<T extends BaseDelegate> {
  create(args: Parameters<T['create']>[0]): ReturnType<T['create']>;
  findMany(args: Parameters<T['findMany']>[0]): ReturnType<T['findMany']>;
  updateMany(args: Parameters<T['updateMany']>[0]): ReturnType<T['updateMany']>;
  update(args: Parameters<T['update']>[0]): ReturnType<T['update']>;
  upsert(args: Parameters<T['upsert']>[0]): ReturnType<T['upsert']>;
  deleteMany(args: Parameters<T['deleteMany']>[0]): ReturnType<T['deleteMany']>;
  delete(args: Parameters<T['delete']>[0]): ReturnType<T['delete']>;
  findFirst(args: Parameters<T['findFirst']>[0]): ReturnType<T['findFirst']>;
  findUnique(args: Parameters<T['findUnique']>[0]): ReturnType<T['findUnique']>;
  aggregate(args: Parameters<T['aggregate']>[0]): ReturnType<T['aggregate']>;
  count(args: Parameters<T['count']>[0]): ReturnType<T['count']>;
}

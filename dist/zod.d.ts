import * as zod from 'zod';
import { z } from 'zod';
import * as zod_v4_core from 'zod/v4/core';

/** Aggregate options with validated take and skip; Prisma selectors remain unvalidated. */
declare const AggregateSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodUnknown>;
    orderBy: z.ZodOptional<z.ZodUnknown>;
    cursor: z.ZodOptional<z.ZodUnknown>;
    take: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodCoercedNumber<string | number>>, z.ZodNumber>>;
    skip: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodCoercedNumber<string | number>>, z.ZodNumber>>;
    _count: z.ZodOptional<z.ZodUnknown>;
    _min: z.ZodOptional<z.ZodUnknown>;
    _max: z.ZodOptional<z.ZodUnknown>;
    _avg: z.ZodOptional<z.ZodUnknown>;
    _sum: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;

/** Count options; the application must validate the Prisma where input. */
declare const CountSchema: z.ZodObject<{
    where: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;

/** Projection options for finding an item by ID. Prisma values require application-specific schemas. */
declare const FindByIdSchema: z.ZodObject<{
    fields: z.ZodOptional<z.ZodString>;
    select: z.ZodOptional<z.ZodUnknown>;
    include: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;

/** List options with validated take and skip values. */
declare const FindManySchema: zod.ZodObject<{
    select: zod.ZodOptional<zod.ZodUnknown>;
    include: zod.ZodOptional<zod.ZodUnknown>;
    where: zod.ZodOptional<zod.ZodUnknown>;
    orderBy: zod.ZodOptional<zod.ZodUnknown>;
    cursor: zod.ZodOptional<zod.ZodUnknown>;
    distinct: zod.ZodOptional<zod.ZodUnknown>;
    take: zod.ZodOptional<zod.ZodPipe<zod.ZodPipe<zod.ZodUnion<readonly [zod.ZodNumber, zod.ZodString]>, zod.ZodCoercedNumber<string | number>>, zod.ZodNumber>>;
    skip: zod.ZodOptional<zod.ZodPipe<zod.ZodPipe<zod.ZodUnion<readonly [zod.ZodNumber, zod.ZodString]>, zod.ZodCoercedNumber<string | number>>, zod.ZodNumber>>;
}, zod_v4_core.$strip>;

/** Options for finding the first matching item; Prisma values are not validated. */
declare const FindOneSchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodUnknown>;
    include: z.ZodOptional<z.ZodUnknown>;
    where: z.ZodOptional<z.ZodUnknown>;
    orderBy: z.ZodOptional<z.ZodUnknown>;
    cursor: z.ZodOptional<z.ZodUnknown>;
    distinct: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;

/** Unique lookup options; like the existing DTO, the base schema does not require where. */
declare const FindUniqueSchema: z.ZodObject<{
    fields: z.ZodOptional<z.ZodString>;
    select: z.ZodOptional<z.ZodUnknown>;
    include: z.ZodOptional<z.ZodUnknown>;
    where: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;

/** Pagination response metadata; validates values without computing or cross-checking them. */
declare const PageMetaSchema: z.ZodObject<{
    page: z.ZodNumber;
    perPage: z.ZodNumber;
    itemCount: z.ZodNumber;
    pageCount: z.ZodNumber;
    hasPrevPage: z.ZodBoolean;
    hasNextPage: z.ZodBoolean;
}, z.core.$strip>;

/** Pagination input with numeric query-string conversion and defaults. */
declare const PageOptionsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodCoercedNumber<string | number>>, z.ZodNumber>>;
    perPage: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodCoercedNumber<string | number>>, z.ZodNumber>>;
}, z.core.$strip>;

/**
 * Creates a schema for the public paginated response envelope.
 *
 * @param {T} itemSchema Schema used to validate each response item.
 * @returns {z.ZodObject<{ items: z.ZodArray<T>; meta: typeof PageMetaSchema }>} Paginated response schema.
 */
declare function createPaginatedSchema<T extends z.ZodType>(itemSchema: T): z.ZodObject<{
    items: z.ZodArray<T>;
    meta: z.ZodObject<{
        page: z.ZodNumber;
        perPage: z.ZodNumber;
        itemCount: z.ZodNumber;
        pageCount: z.ZodNumber;
        hasPrevPage: z.ZodBoolean;
        hasNextPage: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;

/** Paginated resource query with projection, pagination defaults and unvalidated Prisma values. */
declare const QuerySchema: z.ZodObject<{
    select: z.ZodOptional<z.ZodUnknown>;
    include: z.ZodOptional<z.ZodUnknown>;
    where: z.ZodOptional<z.ZodUnknown>;
    orderBy: z.ZodOptional<z.ZodUnknown>;
    cursor: z.ZodOptional<z.ZodUnknown>;
    distinct: z.ZodOptional<z.ZodUnknown>;
    fields: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodCoercedNumber<string | number>>, z.ZodNumber>>;
    perPage: z.ZodDefault<z.ZodPipe<z.ZodPipe<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>, z.ZodCoercedNumber<string | number>>, z.ZodNumber>>;
}, z.core.$strip>;

export { AggregateSchema, CountSchema, FindByIdSchema, FindManySchema, FindOneSchema, FindUniqueSchema, PageMetaSchema, PageOptionsSchema, QuerySchema, createPaginatedSchema };

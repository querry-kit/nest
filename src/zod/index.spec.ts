import { z } from 'zod';

import {
  AggregateSchema,
  CountSchema,
  createPaginatedSchema,
  FindByIdSchema,
  FindManySchema,
  FindOneSchema,
  FindUniqueSchema,
  PageMetaSchema,
  PageOptionsSchema,
  QuerySchema,
} from './index.js';

describe('Zod schemas', () => {
  it.each([FindByIdSchema, FindOneSchema, FindManySchema, FindUniqueSchema, CountSchema, AggregateSchema])(
    'accepts minimal query options and strips unknown keys',
    (schema) => {
      expect(schema.parse({ extra: true })).toEqual({});
    },
  );

  it.each([PageOptionsSchema, QuerySchema])('defaults pagination and converts numeric strings', (schema) => {
    expect(schema.parse({ extra: true })).toEqual({ page: 1, perPage: 10 });
    expect(schema.parse({ page: ' 2 ', perPage: '1000' })).toEqual({ page: 2, perPage: 1000 });
    expect(schema.parse({ page: 1, perPage: 1 })).toEqual({ page: 1, perPage: 1 });
  });

  it.each(['', ' ', null, true, false, [], ['1'], {}, 'no', '1.5', 1.5, NaN, Infinity, -Infinity])(
    'rejects invalid numeric query value %p',
    (value) => {
      for (const schema of [PageOptionsSchema, QuerySchema]) {
        for (const key of ['page', 'perPage']) {
          expect(schema.safeParse({ [key]: value }).success).toBe(false);
        }
      }
      for (const schema of [FindManySchema, AggregateSchema]) {
        for (const key of ['take', 'skip']) {
          expect(schema.safeParse({ [key]: value }).success).toBe(false);
        }
      }
    },
  );

  it('enforces numeric boundaries', () => {
    expect(PageOptionsSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(PageOptionsSchema.safeParse({ perPage: 0 }).success).toBe(false);
    expect(PageOptionsSchema.safeParse({ perPage: 1001 }).success).toBe(false);
    for (const schema of [FindManySchema, AggregateSchema]) {
      expect(schema.parse({ take: '1', skip: '0' })).toEqual({ take: 1, skip: 0 });
      expect(schema.parse({ take: 2, skip: 1 })).toEqual({ take: 2, skip: 1 });
      expect(schema.safeParse({ take: 0 }).success).toBe(false);
      expect(schema.safeParse({ skip: -1 }).success).toBe(false);
    }
  });

  it.each([FindByIdSchema, FindUniqueSchema, QuerySchema])('validates fields strings', (schema) => {
    expect(schema.parse({ fields: 'id,name' }).fields).toBe('id,name');
    expect(schema.safeParse({ fields: 1 }).success).toBe(false);
    expect(schema.safeParse({ fields: null }).success).toBe(false);
  });

  it('preserves every declared Prisma input without claiming to validate it', () => {
    for (const schema of [
      FindByIdSchema,
      FindOneSchema,
      FindManySchema,
      FindUniqueSchema,
      CountSchema,
      AggregateSchema,
      QuerySchema,
    ]) {
      for (const key of Object.keys(schema.shape).filter(
        (key) => !['fields', 'page', 'perPage', 'take', 'skip'].includes(key),
      )) {
        for (const value of [{ nested: { value: true } }, [{ id: 'asc' }], 'id', true, null]) {
          expect(schema.parse({ [key]: value })).toHaveProperty(key, value);
        }
      }
    }
  });

  it('supports model-specific extensions and inferred input/output types', () => {
    const schema = QuerySchema.extend({ where: z.object({ name: z.string() }).optional() });
    const input: z.input<typeof schema> = { page: '2', where: { name: 'Ada' } };
    const output: z.output<typeof schema> = schema.parse(input);
    const inferred: z.infer<typeof schema> = output;
    const page: number = inferred.page;
    // @ts-expect-error Parsed pagination values are numbers.
    const invalidPage: z.infer<typeof schema>['page'] = '2';

    expect(page).toBe(2);
    expect(invalidPage).toBe('2');
    expect(output.where?.name).toBe('Ada');
    expect(schema.safeParse({ where: { name: 123 } }).success).toBe(false);
  });

  it('validates paginated responses including empty results without coercing metadata', () => {
    const schema = createPaginatedSchema(z.object({ id: z.string() }));
    const meta = { page: 1, perPage: 10, itemCount: 0, pageCount: 0, hasPrevPage: false, hasNextPage: false };

    expect(schema.parse({ items: [], meta, extra: true })).toEqual({ items: [], meta });
    expect(schema.parse({ items: [{ id: '1' }], meta: { ...meta, itemCount: 1, pageCount: 1 } }).items).toEqual([
      { id: '1' },
    ]);
    expect(schema.safeParse({ items: [{ id: 1 }], meta }).success).toBe(false);
    expect(schema.safeParse({ items: {}, meta }).success).toBe(false);
    expect(schema.safeParse({ items: [] }).success).toBe(false);
    for (const key of Object.keys(meta)) {
      expect(PageMetaSchema.safeParse({ ...meta, [key]: undefined }).success).toBe(false);
    }
    for (const key of ['page', 'perPage', 'itemCount', 'pageCount']) {
      expect(PageMetaSchema.safeParse({ ...meta, [key]: '1' }).success).toBe(false);
      expect(PageMetaSchema.safeParse({ ...meta, [key]: -1 }).success).toBe(false);
      expect(PageMetaSchema.safeParse({ ...meta, [key]: 1.5 }).success).toBe(false);
    }
    expect(PageMetaSchema.safeParse({ ...meta, page: 0 }).success).toBe(false);
    expect(PageMetaSchema.safeParse({ ...meta, perPage: 0 }).success).toBe(false);
    expect(PageMetaSchema.safeParse({ ...meta, perPage: 1001 }).success).toBe(false);
    expect(PageMetaSchema.safeParse({ ...meta, hasPrevPage: 'false' }).success).toBe(false);
    expect(PageMetaSchema.safeParse({ ...meta, hasNextPage: 1 }).success).toBe(false);
  });
});

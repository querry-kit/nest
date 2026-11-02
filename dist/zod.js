import "./chunk-BRKEJJFQ.js";

// src/zod/aggregate.schema.ts
import { z as z4 } from "zod";

// src/zod/skip.schema.ts
import { z as z2 } from "zod";

// src/zod/integer-query.schema.ts
import { z } from "zod";
var integerQuerySchema = z.union([z.number(), z.string().trim().min(1)]).pipe(z.coerce.number());

// src/zod/skip.schema.ts
var skipSchema = integerQuerySchema.pipe(z2.number().int().min(0)).optional();

// src/zod/take.schema.ts
import { z as z3 } from "zod";
var takeSchema = integerQuerySchema.pipe(z3.number().int().min(1)).optional();

// src/zod/aggregate.schema.ts
var AggregateSchema = z4.object({
  where: z4.unknown().optional(),
  orderBy: z4.unknown().optional(),
  cursor: z4.unknown().optional(),
  take: takeSchema,
  skip: skipSchema,
  _count: z4.unknown().optional(),
  _min: z4.unknown().optional(),
  _max: z4.unknown().optional(),
  _avg: z4.unknown().optional(),
  _sum: z4.unknown().optional()
});

// src/zod/count.schema.ts
import { z as z5 } from "zod";
var CountSchema = z5.object({ where: z5.unknown().optional() });

// src/zod/find-by-id.schema.ts
import { z as z6 } from "zod";
var FindByIdSchema = z6.object({
  fields: z6.string().optional(),
  select: z6.unknown().optional(),
  include: z6.unknown().optional()
});

// src/zod/find-one.schema.ts
import { z as z7 } from "zod";
var FindOneSchema = z7.object({
  select: z7.unknown().optional(),
  include: z7.unknown().optional(),
  where: z7.unknown().optional(),
  orderBy: z7.unknown().optional(),
  cursor: z7.unknown().optional(),
  distinct: z7.unknown().optional()
});

// src/zod/find-many.schema.ts
var FindManySchema = FindOneSchema.extend({ take: takeSchema, skip: skipSchema });

// src/zod/find-unique.schema.ts
import { z as z8 } from "zod";
var FindUniqueSchema = FindByIdSchema.extend({ where: z8.unknown().optional() });

// src/zod/page-meta.schema.ts
import { z as z9 } from "zod";
var PageMetaSchema = z9.object({
  page: z9.number().int().min(1),
  perPage: z9.number().int().min(1).max(1e3),
  itemCount: z9.number().int().min(0),
  pageCount: z9.number().int().min(0),
  hasPrevPage: z9.boolean(),
  hasNextPage: z9.boolean()
});

// src/zod/page-options.schema.ts
import { z as z10 } from "zod";
var PageOptionsSchema = z10.object({
  page: integerQuerySchema.pipe(z10.number().int().min(1)).default(1),
  perPage: integerQuerySchema.pipe(z10.number().int().min(1).max(1e3)).default(10)
});

// src/zod/paginated.schema.ts
import { z as z11 } from "zod";
function createPaginatedSchema(itemSchema) {
  return z11.object({ items: z11.array(itemSchema), meta: PageMetaSchema });
}

// src/zod/query.schema.ts
import { z as z12 } from "zod";
var QuerySchema = FindOneSchema.extend({
  ...PageOptionsSchema.shape,
  fields: z12.string().optional()
});
export {
  AggregateSchema,
  CountSchema,
  FindByIdSchema,
  FindManySchema,
  FindOneSchema,
  FindUniqueSchema,
  PageMetaSchema,
  PageOptionsSchema,
  QuerySchema,
  createPaginatedSchema
};
//# sourceMappingURL=zod.js.map
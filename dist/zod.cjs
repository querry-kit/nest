"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/zod/index.ts
var zod_exports = {};
__export(zod_exports, {
  AggregateSchema: () => AggregateSchema,
  CountSchema: () => CountSchema,
  FindByIdSchema: () => FindByIdSchema,
  FindManySchema: () => FindManySchema,
  FindOneSchema: () => FindOneSchema,
  FindUniqueSchema: () => FindUniqueSchema,
  PageMetaSchema: () => PageMetaSchema,
  PageOptionsSchema: () => PageOptionsSchema,
  QuerySchema: () => QuerySchema,
  createPaginatedSchema: () => createPaginatedSchema
});
module.exports = __toCommonJS(zod_exports);

// src/zod/aggregate.schema.ts
var import_zod4 = require("zod");

// src/zod/skip.schema.ts
var import_zod2 = require("zod");

// src/zod/integer-query.schema.ts
var import_zod = require("zod");
var integerQuerySchema = import_zod.z.union([import_zod.z.number(), import_zod.z.string().trim().min(1)]).pipe(import_zod.z.coerce.number());

// src/zod/skip.schema.ts
var skipSchema = integerQuerySchema.pipe(import_zod2.z.number().int().min(0)).optional();

// src/zod/take.schema.ts
var import_zod3 = require("zod");
var takeSchema = integerQuerySchema.pipe(import_zod3.z.number().int().min(1)).optional();

// src/zod/aggregate.schema.ts
var AggregateSchema = import_zod4.z.object({
  where: import_zod4.z.unknown().optional(),
  orderBy: import_zod4.z.unknown().optional(),
  cursor: import_zod4.z.unknown().optional(),
  take: takeSchema,
  skip: skipSchema,
  _count: import_zod4.z.unknown().optional(),
  _min: import_zod4.z.unknown().optional(),
  _max: import_zod4.z.unknown().optional(),
  _avg: import_zod4.z.unknown().optional(),
  _sum: import_zod4.z.unknown().optional()
});

// src/zod/count.schema.ts
var import_zod5 = require("zod");
var CountSchema = import_zod5.z.object({ where: import_zod5.z.unknown().optional() });

// src/zod/find-by-id.schema.ts
var import_zod6 = require("zod");
var FindByIdSchema = import_zod6.z.object({
  fields: import_zod6.z.string().optional(),
  select: import_zod6.z.unknown().optional(),
  include: import_zod6.z.unknown().optional()
});

// src/zod/find-one.schema.ts
var import_zod7 = require("zod");
var FindOneSchema = import_zod7.z.object({
  select: import_zod7.z.unknown().optional(),
  include: import_zod7.z.unknown().optional(),
  where: import_zod7.z.unknown().optional(),
  orderBy: import_zod7.z.unknown().optional(),
  cursor: import_zod7.z.unknown().optional(),
  distinct: import_zod7.z.unknown().optional()
});

// src/zod/find-many.schema.ts
var FindManySchema = FindOneSchema.extend({ take: takeSchema, skip: skipSchema });

// src/zod/find-unique.schema.ts
var import_zod8 = require("zod");
var FindUniqueSchema = FindByIdSchema.extend({ where: import_zod8.z.unknown().optional() });

// src/zod/page-meta.schema.ts
var import_zod9 = require("zod");
var PageMetaSchema = import_zod9.z.object({
  page: import_zod9.z.number().int().min(1),
  perPage: import_zod9.z.number().int().min(1).max(1e3),
  itemCount: import_zod9.z.number().int().min(0),
  pageCount: import_zod9.z.number().int().min(0),
  hasPrevPage: import_zod9.z.boolean(),
  hasNextPage: import_zod9.z.boolean()
});

// src/zod/page-options.schema.ts
var import_zod10 = require("zod");
var PageOptionsSchema = import_zod10.z.object({
  page: integerQuerySchema.pipe(import_zod10.z.number().int().min(1)).default(1),
  perPage: integerQuerySchema.pipe(import_zod10.z.number().int().min(1).max(1e3)).default(10)
});

// src/zod/paginated.schema.ts
var import_zod11 = require("zod");
function createPaginatedSchema(itemSchema) {
  return import_zod11.z.object({ items: import_zod11.z.array(itemSchema), meta: PageMetaSchema });
}

// src/zod/query.schema.ts
var import_zod12 = require("zod");
var QuerySchema = FindOneSchema.extend({
  ...PageOptionsSchema.shape,
  fields: import_zod12.z.string().optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=zod.cjs.map
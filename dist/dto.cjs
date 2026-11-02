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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/dto/index.ts
var dto_exports = {};
__export(dto_exports, {
  AggregateDTO: () => AggregateDTO,
  CountDTO: () => CountDTO,
  FindByIdDTO: () => FindByIdDTO,
  FindManyDTO: () => FindManyDTO,
  FindOneDTO: () => FindOneDTO,
  FindUniqueDTO: () => FindUniqueDTO,
  QueryDTO: () => QueryDTO
});
module.exports = __toCommonJS(dto_exports);

// src/dto/aggregate.dto.ts
var import_swagger = require("@nestjs/swagger");
var import_class_transformer = require("class-transformer");
var import_class_validator = require("class-validator");
var AggregateDTO = class {
  where;
  orderBy;
  cursor;
  take;
  skip;
  _count;
  _min;
  _max;
  _avg;
  _sum;
};
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "where", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma orderBy object or array." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "orderBy", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma cursor object." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "cursor", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Maximum number of items to aggregate.", minimum: 1 }),
  (0, import_class_transformer.Type)(() => Number),
  (0, import_class_validator.IsInt)(),
  (0, import_class_validator.Min)(1),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "take", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Number of items to skip.", minimum: 0 }),
  (0, import_class_transformer.Type)(() => Number),
  (0, import_class_validator.IsInt)(),
  (0, import_class_validator.Min)(0),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "skip", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma _count aggregate selector." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "_count", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma _min aggregate selector." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "_min", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma _max aggregate selector." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "_max", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma _avg aggregate selector." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "_avg", 2);
__decorateClass([
  (0, import_swagger.ApiPropertyOptional)({ description: "Prisma _sum aggregate selector." }),
  (0, import_class_validator.IsOptional)()
], AggregateDTO.prototype, "_sum", 2);

// src/dto/count.dto.ts
var import_swagger2 = require("@nestjs/swagger");
var import_class_validator2 = require("class-validator");
var CountDTO = class {
  where;
};
__decorateClass([
  (0, import_swagger2.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator2.IsOptional)()
], CountDTO.prototype, "where", 2);

// src/dto/find-by-id.dto.ts
var import_swagger3 = require("@nestjs/swagger");
var import_class_validator3 = require("class-validator");
var FindByIdDTO = class {
  fields;
  select;
  include;
};
__decorateClass([
  (0, import_swagger3.ApiPropertyOptional)({ description: "Fields projection query, for example `id,name,profile{firstName}`." }),
  (0, import_class_validator3.IsString)(),
  (0, import_class_validator3.IsOptional)()
], FindByIdDTO.prototype, "fields", 2);
__decorateClass([
  (0, import_swagger3.ApiPropertyOptional)({ description: "Prisma select object." }),
  (0, import_class_validator3.IsOptional)()
], FindByIdDTO.prototype, "select", 2);
__decorateClass([
  (0, import_swagger3.ApiPropertyOptional)({ description: "Prisma include object." }),
  (0, import_class_validator3.IsOptional)()
], FindByIdDTO.prototype, "include", 2);

// src/dto/find-many.dto.ts
var import_swagger5 = require("@nestjs/swagger");
var import_class_transformer2 = require("class-transformer");
var import_class_validator5 = require("class-validator");

// src/dto/find-one.dto.ts
var import_swagger4 = require("@nestjs/swagger");
var import_class_validator4 = require("class-validator");
var FindOneDTO = class {
  select;
  include;
  where;
  orderBy;
  cursor;
  distinct;
};
__decorateClass([
  (0, import_swagger4.ApiPropertyOptional)({ description: "Prisma select object." }),
  (0, import_class_validator4.IsOptional)()
], FindOneDTO.prototype, "select", 2);
__decorateClass([
  (0, import_swagger4.ApiPropertyOptional)({ description: "Prisma include object." }),
  (0, import_class_validator4.IsOptional)()
], FindOneDTO.prototype, "include", 2);
__decorateClass([
  (0, import_swagger4.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator4.IsOptional)()
], FindOneDTO.prototype, "where", 2);
__decorateClass([
  (0, import_swagger4.ApiPropertyOptional)({ description: "Prisma orderBy object or array." }),
  (0, import_class_validator4.IsOptional)()
], FindOneDTO.prototype, "orderBy", 2);
__decorateClass([
  (0, import_swagger4.ApiPropertyOptional)({ description: "Prisma cursor object." }),
  (0, import_class_validator4.IsOptional)()
], FindOneDTO.prototype, "cursor", 2);
__decorateClass([
  (0, import_swagger4.ApiPropertyOptional)({ description: "Prisma distinct field or fields." }),
  (0, import_class_validator4.IsOptional)()
], FindOneDTO.prototype, "distinct", 2);

// src/dto/find-many.dto.ts
var FindManyDTO = class extends FindOneDTO {
  take;
  skip;
};
__decorateClass([
  (0, import_swagger5.ApiPropertyOptional)({ description: "Maximum number of items to return.", minimum: 1 }),
  (0, import_class_transformer2.Type)(() => Number),
  (0, import_class_validator5.IsInt)(),
  (0, import_class_validator5.Min)(1),
  (0, import_class_validator5.IsOptional)()
], FindManyDTO.prototype, "take", 2);
__decorateClass([
  (0, import_swagger5.ApiPropertyOptional)({ description: "Number of items to skip.", minimum: 0 }),
  (0, import_class_transformer2.Type)(() => Number),
  (0, import_class_validator5.IsInt)(),
  (0, import_class_validator5.Min)(0),
  (0, import_class_validator5.IsOptional)()
], FindManyDTO.prototype, "skip", 2);

// src/dto/find-unique.dto.ts
var import_swagger6 = require("@nestjs/swagger");
var import_class_validator6 = require("class-validator");
var FindUniqueDTO = class extends FindByIdDTO {
  where;
};
__decorateClass([
  (0, import_swagger6.ApiPropertyOptional)({ description: "Prisma unique where object." }),
  (0, import_class_validator6.IsOptional)()
], FindUniqueDTO.prototype, "where", 2);

// src/dto/query.dto.ts
var import_swagger8 = require("@nestjs/swagger");
var import_class_validator8 = require("class-validator");

// src/pagination/page-options.dto.ts
var import_swagger7 = require("@nestjs/swagger");
var import_class_transformer3 = require("class-transformer");
var import_class_validator7 = require("class-validator");
var PageOptionsDTO = class {
  page = 1;
  perPage = 10;
};
__decorateClass([
  (0, import_swagger7.ApiPropertyOptional)({ type: Number, description: "Current page number.", default: 1, minimum: 1 }),
  (0, import_class_transformer3.Type)(() => Number),
  (0, import_class_validator7.IsInt)(),
  (0, import_class_validator7.Min)(1),
  (0, import_class_validator7.IsOptional)()
], PageOptionsDTO.prototype, "page", 2);
__decorateClass([
  (0, import_swagger7.ApiPropertyOptional)({
    type: Number,
    description: "Number of items per page.",
    default: 10,
    minimum: 1,
    maximum: 1e3
  }),
  (0, import_class_transformer3.Type)(() => Number),
  (0, import_class_validator7.IsInt)(),
  (0, import_class_validator7.Min)(1),
  (0, import_class_validator7.Max)(1e3),
  (0, import_class_validator7.IsOptional)()
], PageOptionsDTO.prototype, "perPage", 2);

// src/dto/query.dto.ts
var QueryDTO = class extends PageOptionsDTO {
  fields;
  select;
  include;
  where;
  orderBy;
  cursor;
  distinct;
};
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Fields projection query, for example `id,name,profile{firstName}`." }),
  (0, import_class_validator8.IsString)(),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "fields", 2);
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Prisma select object." }),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "select", 2);
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Prisma include object." }),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "include", 2);
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Prisma where object." }),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "where", 2);
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Prisma orderBy object or array." }),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "orderBy", 2);
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Prisma cursor object." }),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "cursor", 2);
__decorateClass([
  (0, import_swagger8.ApiPropertyOptional)({ description: "Prisma distinct field or fields." }),
  (0, import_class_validator8.IsOptional)()
], QueryDTO.prototype, "distinct", 2);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AggregateDTO,
  CountDTO,
  FindByIdDTO,
  FindManyDTO,
  FindOneDTO,
  FindUniqueDTO,
  QueryDTO
});
//# sourceMappingURL=dto.cjs.map
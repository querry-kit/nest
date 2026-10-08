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

// src/pagination/index.ts
var pagination_exports = {};
__export(pagination_exports, {
  PageMetaDTO: () => PageMetaDTO,
  PageOptionsDTO: () => PageOptionsDTO,
  PaginatedDTO: () => PaginatedDTO
});
module.exports = __toCommonJS(pagination_exports);

// src/pagination/page-meta.dto.ts
var import_swagger = require("@nestjs/swagger");
var import_class_transformer = require("class-transformer");
var PageMetaDTO = class {
  page;
  perPage;
  itemCount;
  pageCount;
  hasPrevPage;
  hasNextPage;
  /**
   * Creates pagination metadata.
   *
   * @param params Pagination options and item count.
   */
  constructor({ pageOptions, itemCount }) {
    this.page = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
};
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Current page number." })
], PageMetaDTO.prototype, "page", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Number of items per page." })
], PageMetaDTO.prototype, "perPage", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Total number of items." })
], PageMetaDTO.prototype, "itemCount", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Number, description: "Total number of pages." })
], PageMetaDTO.prototype, "pageCount", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Boolean, description: "Indicates whether a previous page exists." })
], PageMetaDTO.prototype, "hasPrevPage", 2);
__decorateClass([
  (0, import_class_transformer.Expose)(),
  (0, import_swagger.ApiProperty)({ type: Boolean, description: "Indicates whether a next page exists." })
], PageMetaDTO.prototype, "hasNextPage", 2);

// src/pagination/page-options.dto.ts
var import_swagger2 = require("@nestjs/swagger");
var import_class_transformer2 = require("class-transformer");
var import_class_validator = require("class-validator");
var PageOptionsDTO = class {
  page = 1;
  perPage = 10;
};
__decorateClass([
  (0, import_swagger2.ApiPropertyOptional)({ type: Number, description: "Current page number.", default: 1, minimum: 1 }),
  (0, import_class_transformer2.Type)(() => Number),
  (0, import_class_validator.IsInt)(),
  (0, import_class_validator.Min)(1),
  (0, import_class_validator.IsOptional)()
], PageOptionsDTO.prototype, "page", 2);
__decorateClass([
  (0, import_swagger2.ApiPropertyOptional)({
    type: Number,
    description: "Number of items per page.",
    default: 10,
    minimum: 1,
    maximum: 1e3
  }),
  (0, import_class_transformer2.Type)(() => Number),
  (0, import_class_validator.IsInt)(),
  (0, import_class_validator.Min)(1),
  (0, import_class_validator.Max)(1e3),
  (0, import_class_validator.IsOptional)()
], PageOptionsDTO.prototype, "perPage", 2);

// src/pagination/paginated.dto.ts
var import_swagger3 = require("@nestjs/swagger");
var import_class_transformer3 = require("class-transformer");
var import_class_validator2 = require("class-validator");
var PaginatedDTO = class {
  items;
  meta;
  /**
   * Creates a paginated DTO.
   *
   * @param items Items on the current page.
   * @param meta Pagination metadata.
   */
  constructor(items, meta) {
    this.items = items;
    this.meta = meta;
  }
};
__decorateClass([
  (0, import_class_transformer3.Expose)(),
  (0, import_swagger3.ApiProperty)({ type: () => [Object], description: "Items on the current page." }),
  (0, import_class_validator2.IsArray)()
], PaginatedDTO.prototype, "items", 2);
__decorateClass([
  (0, import_class_transformer3.Expose)(),
  (0, import_swagger3.ApiProperty)({ type: () => PageMetaDTO, description: "Pagination metadata." }),
  (0, import_class_transformer3.Type)(() => PageMetaDTO),
  (0, import_class_validator2.ValidateNested)()
], PaginatedDTO.prototype, "meta", 2);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PageMetaDTO,
  PageOptionsDTO,
  PaginatedDTO
});
//# sourceMappingURL=pagination.cjs.map
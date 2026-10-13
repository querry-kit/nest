import {
  PageMetaDTO
} from "./chunk-V7UTPUGM.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/pagination/paginated.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
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
  Expose(),
  ApiProperty({ type: () => [Object], description: "Items on the current page." }),
  IsArray()
], PaginatedDTO.prototype, "items", 2);
__decorateClass([
  Expose(),
  ApiProperty({ type: () => PageMetaDTO, description: "Pagination metadata." }),
  Type(() => PageMetaDTO),
  ValidateNested()
], PaginatedDTO.prototype, "meta", 2);

export {
  PaginatedDTO
};
//# sourceMappingURL=chunk-MZ5JIS52.js.map
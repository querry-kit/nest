import {
  PageMeta
} from "./chunk-BY2B2WWN.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/pagination/page-meta.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
var PageMetaDTO = class extends PageMeta {
  /**
   * Creates decorated pagination metadata.
   *
   * @param {PageMetaDTOParams} params Pagination options and item count.
   */
  constructor(params) {
    super(params);
  }
};
__decorateClass([
  Expose(),
  ApiProperty({ type: Number, description: "Current page number." })
], PageMetaDTO.prototype, "page", 2);
__decorateClass([
  Expose(),
  ApiProperty({ type: Number, description: "Number of items per page." })
], PageMetaDTO.prototype, "perPage", 2);
__decorateClass([
  Expose(),
  ApiProperty({ type: Number, description: "Total number of items." })
], PageMetaDTO.prototype, "itemCount", 2);
__decorateClass([
  Expose(),
  ApiProperty({ type: Number, description: "Total number of pages." })
], PageMetaDTO.prototype, "pageCount", 2);
__decorateClass([
  Expose(),
  ApiProperty({ type: Boolean, description: "Indicates whether a previous page exists." })
], PageMetaDTO.prototype, "hasPrevPage", 2);
__decorateClass([
  Expose(),
  ApiProperty({ type: Boolean, description: "Indicates whether a next page exists." })
], PageMetaDTO.prototype, "hasNextPage", 2);

export {
  PageMetaDTO
};
//# sourceMappingURL=chunk-GKLTIPLP.js.map
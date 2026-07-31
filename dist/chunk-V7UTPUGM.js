import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/pagination/page-meta.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
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
//# sourceMappingURL=chunk-V7UTPUGM.js.map
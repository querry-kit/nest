import {
  QueryService
} from "./chunk-VUYFIPLF.js";
import {
  PageMetaDTO
} from "./chunk-GKLTIPLP.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/query-service/query.service.ts
import { Injectable } from "@nestjs/common";
var QueryService2 = class extends QueryService {
  /**
   * Creates the legacy decorated pagination metadata.
   *
   * @param {PageMetaDTOParams} params Pagination options and item count.
   * @returns {PageMetaDTO} Decorated pagination metadata.
   */
  createPageMeta(params) {
    return new PageMetaDTO(params);
  }
};
QueryService2 = __decorateClass([
  Injectable()
], QueryService2);

export {
  QueryService2 as QueryService
};
//# sourceMappingURL=chunk-OD3D5BI4.js.map
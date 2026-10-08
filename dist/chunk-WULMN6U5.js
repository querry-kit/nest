import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/pagination/page-options.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
var PageOptionsDTO = class {
  page = 1;
  perPage = 10;
};
__decorateClass([
  ApiPropertyOptional({ type: Number, description: "Current page number.", default: 1, minimum: 1 }),
  Type(() => Number),
  IsInt(),
  Min(1),
  IsOptional()
], PageOptionsDTO.prototype, "page", 2);
__decorateClass([
  ApiPropertyOptional({
    type: Number,
    description: "Number of items per page.",
    default: 10,
    minimum: 1,
    maximum: 1e3
  }),
  Type(() => Number),
  IsInt(),
  Min(1),
  Max(1e3),
  IsOptional()
], PageOptionsDTO.prototype, "perPage", 2);

export {
  PageOptionsDTO
};
//# sourceMappingURL=chunk-WULMN6U5.js.map
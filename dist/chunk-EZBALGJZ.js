import {
  PageOptionsDTO
} from "./chunk-WULMN6U5.js";
import {
  __decorateClass
} from "./chunk-BRKEJJFQ.js";

// src/dto/aggregate.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";
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
  ApiPropertyOptional({ description: "Prisma where object." }),
  IsOptional()
], AggregateDTO.prototype, "where", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma orderBy object or array." }),
  IsOptional()
], AggregateDTO.prototype, "orderBy", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma cursor object." }),
  IsOptional()
], AggregateDTO.prototype, "cursor", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Maximum number of items to aggregate.", minimum: 1 }),
  Type(() => Number),
  IsInt(),
  Min(1),
  IsOptional()
], AggregateDTO.prototype, "take", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Number of items to skip.", minimum: 0 }),
  Type(() => Number),
  IsInt(),
  Min(0),
  IsOptional()
], AggregateDTO.prototype, "skip", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma _count aggregate selector." }),
  IsOptional()
], AggregateDTO.prototype, "_count", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma _min aggregate selector." }),
  IsOptional()
], AggregateDTO.prototype, "_min", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma _max aggregate selector." }),
  IsOptional()
], AggregateDTO.prototype, "_max", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma _avg aggregate selector." }),
  IsOptional()
], AggregateDTO.prototype, "_avg", 2);
__decorateClass([
  ApiPropertyOptional({ description: "Prisma _sum aggregate selector." }),
  IsOptional()
], AggregateDTO.prototype, "_sum", 2);

// src/dto/count.dto.ts
import { ApiPropertyOptional as ApiPropertyOptional2 } from "@nestjs/swagger";
import { IsOptional as IsOptional2 } from "class-validator";
var CountDTO = class {
  where;
};
__decorateClass([
  ApiPropertyOptional2({ description: "Prisma where object." }),
  IsOptional2()
], CountDTO.prototype, "where", 2);

// src/dto/find-by-id.dto.ts
import { ApiPropertyOptional as ApiPropertyOptional3 } from "@nestjs/swagger";
import { IsOptional as IsOptional3, IsString } from "class-validator";
var FindByIdDTO = class {
  fields;
  select;
  include;
};
__decorateClass([
  ApiPropertyOptional3({ description: "Fields projection query, for example `id,name,profile{firstName}`." }),
  IsString(),
  IsOptional3()
], FindByIdDTO.prototype, "fields", 2);
__decorateClass([
  ApiPropertyOptional3({ description: "Prisma select object." }),
  IsOptional3()
], FindByIdDTO.prototype, "select", 2);
__decorateClass([
  ApiPropertyOptional3({ description: "Prisma include object." }),
  IsOptional3()
], FindByIdDTO.prototype, "include", 2);

// src/dto/find-many.dto.ts
import { ApiPropertyOptional as ApiPropertyOptional5 } from "@nestjs/swagger";
import { Type as Type2 } from "class-transformer";
import { IsInt as IsInt2, IsOptional as IsOptional5, Min as Min2 } from "class-validator";

// src/dto/find-one.dto.ts
import { ApiPropertyOptional as ApiPropertyOptional4 } from "@nestjs/swagger";
import { IsOptional as IsOptional4 } from "class-validator";
var FindOneDTO = class {
  select;
  include;
  where;
  orderBy;
  cursor;
  distinct;
};
__decorateClass([
  ApiPropertyOptional4({ description: "Prisma select object." }),
  IsOptional4()
], FindOneDTO.prototype, "select", 2);
__decorateClass([
  ApiPropertyOptional4({ description: "Prisma include object." }),
  IsOptional4()
], FindOneDTO.prototype, "include", 2);
__decorateClass([
  ApiPropertyOptional4({ description: "Prisma where object." }),
  IsOptional4()
], FindOneDTO.prototype, "where", 2);
__decorateClass([
  ApiPropertyOptional4({ description: "Prisma orderBy object or array." }),
  IsOptional4()
], FindOneDTO.prototype, "orderBy", 2);
__decorateClass([
  ApiPropertyOptional4({ description: "Prisma cursor object." }),
  IsOptional4()
], FindOneDTO.prototype, "cursor", 2);
__decorateClass([
  ApiPropertyOptional4({ description: "Prisma distinct field or fields." }),
  IsOptional4()
], FindOneDTO.prototype, "distinct", 2);

// src/dto/find-many.dto.ts
var FindManyDTO = class extends FindOneDTO {
  take;
  skip;
};
__decorateClass([
  ApiPropertyOptional5({ description: "Maximum number of items to return.", minimum: 1 }),
  Type2(() => Number),
  IsInt2(),
  Min2(1),
  IsOptional5()
], FindManyDTO.prototype, "take", 2);
__decorateClass([
  ApiPropertyOptional5({ description: "Number of items to skip.", minimum: 0 }),
  Type2(() => Number),
  IsInt2(),
  Min2(0),
  IsOptional5()
], FindManyDTO.prototype, "skip", 2);

// src/dto/find-unique.dto.ts
import { ApiPropertyOptional as ApiPropertyOptional6 } from "@nestjs/swagger";
import { IsOptional as IsOptional6 } from "class-validator";
var FindUniqueDTO = class extends FindByIdDTO {
  where;
};
__decorateClass([
  ApiPropertyOptional6({ description: "Prisma unique where object." }),
  IsOptional6()
], FindUniqueDTO.prototype, "where", 2);

// src/dto/query.dto.ts
import { ApiPropertyOptional as ApiPropertyOptional7 } from "@nestjs/swagger";
import { IsOptional as IsOptional7, IsString as IsString2 } from "class-validator";
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
  ApiPropertyOptional7({ description: "Fields projection query, for example `id,name,profile{firstName}`." }),
  IsString2(),
  IsOptional7()
], QueryDTO.prototype, "fields", 2);
__decorateClass([
  ApiPropertyOptional7({ description: "Prisma select object." }),
  IsOptional7()
], QueryDTO.prototype, "select", 2);
__decorateClass([
  ApiPropertyOptional7({ description: "Prisma include object." }),
  IsOptional7()
], QueryDTO.prototype, "include", 2);
__decorateClass([
  ApiPropertyOptional7({ description: "Prisma where object." }),
  IsOptional7()
], QueryDTO.prototype, "where", 2);
__decorateClass([
  ApiPropertyOptional7({ description: "Prisma orderBy object or array." }),
  IsOptional7()
], QueryDTO.prototype, "orderBy", 2);
__decorateClass([
  ApiPropertyOptional7({ description: "Prisma cursor object." }),
  IsOptional7()
], QueryDTO.prototype, "cursor", 2);
__decorateClass([
  ApiPropertyOptional7({ description: "Prisma distinct field or fields." }),
  IsOptional7()
], QueryDTO.prototype, "distinct", 2);

export {
  AggregateDTO,
  CountDTO,
  FindByIdDTO,
  FindOneDTO,
  FindManyDTO,
  FindUniqueDTO,
  QueryDTO
};
//# sourceMappingURL=chunk-EZBALGJZ.js.map
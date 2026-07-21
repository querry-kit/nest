import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';
import { FindOneDTO } from './find-one.dto.js';

/**
 * Query options for finding many items.
 */
export class FindManyDTO<
  TM extends BaseDelegateTypeMap,
  T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>,
> extends FindOneDTO<TM, T> {
  @ApiPropertyOptional({ description: 'Maximum number of items to return.', minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  take?: number;

  @ApiPropertyOptional({ description: 'Number of items to skip.', minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number;
}

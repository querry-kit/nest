import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';

/**
 * Query options for aggregate operations.
 */
export class AggregateDTO<TM extends BaseDelegateTypeMap, T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>> {
  @ApiPropertyOptional({ description: 'Prisma where object.' })
  @IsOptional()
  where?: T['where'];

  @ApiPropertyOptional({ description: 'Prisma orderBy object or array.' })
  @IsOptional()
  orderBy?: T['orderBy'] | T['orderBy'][];

  @ApiPropertyOptional({ description: 'Prisma cursor object.' })
  @IsOptional()
  cursor?: T['cursor'];

  @ApiPropertyOptional({ description: 'Maximum number of items to aggregate.', minimum: 1 })
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

  @ApiPropertyOptional({ description: 'Prisma _count aggregate selector.' })
  @IsOptional()
  _count?: T['aggregate']['_count'];

  @ApiPropertyOptional({ description: 'Prisma _min aggregate selector.' })
  @IsOptional()
  _min?: T['aggregate']['_min'];

  @ApiPropertyOptional({ description: 'Prisma _max aggregate selector.' })
  @IsOptional()
  _max?: T['aggregate']['_max'];

  @ApiPropertyOptional({ description: 'Prisma _avg aggregate selector.' })
  @IsOptional()
  _avg?: T['aggregate']['_avg'];

  @ApiPropertyOptional({ description: 'Prisma _sum aggregate selector.' })
  @IsOptional()
  _sum?: T['aggregate']['_sum'];
}

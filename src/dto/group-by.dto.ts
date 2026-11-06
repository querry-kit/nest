import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import type { BaseDelegateTypeMap } from './delegate.types.js';

/** Optional generated Prisma types used only by grouping operations. */
export interface GroupByTypeMap {
  /** Prisma ModelOrderByWithAggregationInput. */
  orderByWithAggregationInput?: unknown;
  /** Prisma ModelScalarWhereWithAggregatesInput. */
  scalarWhereWithAggregatesInput?: unknown;
}

/** Independent capability; existing query delegates need not implement grouping. */
export interface GroupByDelegate<TArgs = Record<string, unknown>, TResult = unknown> {
  groupBy(args: TArgs): Promise<TResult[]> | TResult[];
}

/** Prisma-compatible options for grouping scalar fields. */
export class GroupByDTO<TM extends BaseDelegateTypeMap & GroupByTypeMap = BaseDelegateTypeMap> {
  @ApiProperty({ type: [String], minItems: 1, description: 'Scalar fields to group by.' })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  by!: TM['scalarFieldEnum'][];

  @ApiPropertyOptional({ description: 'Filter records before grouping.' })
  @IsOptional()
  where?: TM['whereInput'];

  @ApiPropertyOptional({ description: 'Filter groups by scalar or aggregate conditions.' })
  @IsOptional()
  having?: TM['scalarWhereWithAggregatesInput'];

  @ApiPropertyOptional({ description: 'Group key or aggregate ordering; required with take/skip.' })
  @IsOptional()
  orderBy?: TM['orderByWithAggregationInput'] | TM['orderByWithAggregationInput'][];

  @ApiPropertyOptional({ minimum: 1, description: 'Maximum groups to return.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  take?: number;

  @ApiPropertyOptional({ minimum: 0, description: 'Groups to skip.' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({ description: 'Prisma _count aggregate selector.' })
  @IsOptional()
  _count?: TM['aggregateInputType']['_count'];

  @ApiPropertyOptional({ description: 'Prisma _sum aggregate selector.' })
  @IsOptional()
  _sum?: TM['aggregateInputType']['_sum'];

  @ApiPropertyOptional({ description: 'Prisma _avg aggregate selector.' })
  @IsOptional()
  _avg?: TM['aggregateInputType']['_avg'];

  @ApiPropertyOptional({ description: 'Prisma _min aggregate selector.' })
  @IsOptional()
  _min?: TM['aggregateInputType']['_min'];

  @ApiPropertyOptional({ description: 'Prisma _max aggregate selector.' })
  @IsOptional()
  _max?: TM['aggregateInputType']['_max'];
}

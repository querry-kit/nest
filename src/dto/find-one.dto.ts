import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';

/**
 * Query options for finding the first matching item.
 */
export class FindOneDTO<TM extends BaseDelegateTypeMap, T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>> {
  @ApiPropertyOptional({ description: 'Prisma select object.' })
  @IsOptional()
  select?: T['select'];

  @ApiPropertyOptional({ description: 'Prisma include object.' })
  @IsOptional()
  include?: T['include'];

  @ApiPropertyOptional({ description: 'Prisma where object.' })
  @IsOptional()
  where?: T['where'];

  @ApiPropertyOptional({ description: 'Prisma orderBy object or array.' })
  @IsOptional()
  orderBy?: T['orderBy'] | T['orderBy'][];

  @ApiPropertyOptional({ description: 'Prisma cursor object.' })
  @IsOptional()
  cursor?: T['cursor'];

  @ApiPropertyOptional({ description: 'Prisma distinct field or fields.' })
  @IsOptional()
  distinct?: T['distinct'] | T['distinct'][];
}

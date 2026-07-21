import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDTO } from '../pagination/page-options.dto.js';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';

/**
 * Paginated query DTO for Prisma-like resource endpoints.
 */
export class QueryDTO<
  TM extends BaseDelegateTypeMap,
  T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>,
> extends PageOptionsDTO {
  @ApiPropertyOptional({ description: 'Fields projection query, for example `id,name,profile{firstName}`.' })
  @IsString()
  @IsOptional()
  fields?: string;

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

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';

/**
 * Query options for finding an item by ID.
 */
export class FindByIdDTO<TM extends BaseDelegateTypeMap, T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>> {
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
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';
import { FindByIdDTO } from './find-by-id.dto.js';

/**
 * Query options for finding an item by a unique where input.
 */
export class FindUniqueDTO<
  TM extends BaseDelegateTypeMap,
  T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>,
> extends FindByIdDTO<TM, T> {
  @ApiPropertyOptional({ description: 'Prisma unique where object.' })
  @IsOptional()
  where!: T['where'];
}

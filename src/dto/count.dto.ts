import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import type { BaseDelegateTypeMap, DelegateTypeMap } from './delegate.types.js';

/**
 * Query options for count operations.
 */
export class CountDTO<TM extends BaseDelegateTypeMap, T extends DelegateTypeMap<TM> = DelegateTypeMap<TM>> {
  @ApiPropertyOptional({ description: 'Prisma where object.' })
  @IsOptional()
  where?: T['where'];
}

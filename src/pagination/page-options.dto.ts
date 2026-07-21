import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * Query DTO for pagination options.
 */
export class PageOptionsDTO {
  @ApiPropertyOptional({ type: Number, description: 'Current page number.', default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    type: Number,
    description: 'Number of items per page.',
    default: 10,
    minimum: 1,
    maximum: 1000,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  readonly perPage: number = 10;
}

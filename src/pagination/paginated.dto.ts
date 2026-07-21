import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { PageMetaDTO } from './page-meta.dto.js';

/**
 * DTO for paginated API responses.
 */
export class PaginatedDTO<T> {
  @Expose()
  @ApiProperty({ type: () => [Object], description: 'Items on the current page.' })
  @IsArray()
  readonly items: T[];

  @Expose()
  @ApiProperty({ type: () => PageMetaDTO, description: 'Pagination metadata.' })
  @Type(() => PageMetaDTO)
  @ValidateNested()
  readonly meta: PageMetaDTO;

  /**
   * Creates a paginated DTO.
   *
   * @param items Items on the current page.
   * @param meta Pagination metadata.
   */
  constructor(items: T[], meta: PageMetaDTO) {
    this.items = items;
    this.meta = meta;
  }
}

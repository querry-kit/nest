import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { PageMeta, type PageMetaParams } from '../core/page-meta.js';

/** Constructor parameters for decorated pagination metadata. */
export interface PageMetaDTOParams extends PageMetaParams {}

/**
 * DTO describing pagination metadata for a paginated response.
 */
export class PageMetaDTO extends PageMeta {
  @Expose()
  @ApiProperty({ type: Number, description: 'Current page number.' })
  declare readonly page: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Number of items per page.' })
  declare readonly perPage: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Total number of items.' })
  declare readonly itemCount: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Total number of pages.' })
  declare readonly pageCount: number;

  @Expose()
  @ApiProperty({ type: Boolean, description: 'Indicates whether a previous page exists.' })
  declare readonly hasPrevPage: boolean;

  @Expose()
  @ApiProperty({ type: Boolean, description: 'Indicates whether a next page exists.' })
  declare readonly hasNextPage: boolean;

  /**
   * Creates decorated pagination metadata.
   *
   * @param {PageMetaDTOParams} params Pagination options and item count.
   */
  constructor(params: PageMetaDTOParams) {
    super(params);
  }
}

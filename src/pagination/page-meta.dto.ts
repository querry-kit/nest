import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { PageOptionsDTO } from './page-options.dto.js';

/**
 * Constructor parameters for {@link PageMetaDTO}.
 */
export interface PageMetaDTOParams {
  /** Requested page and page size. */
  pageOptions: Pick<PageOptionsDTO, 'page' | 'perPage'>;
  /** Total number of items matching the query. */
  itemCount: number;
}

/**
 * DTO describing pagination metadata for a paginated response.
 */
export class PageMetaDTO {
  @Expose()
  @ApiProperty({ type: Number, description: 'Current page number.' })
  readonly page: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Number of items per page.' })
  readonly perPage: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Total number of items.' })
  readonly itemCount: number;

  @Expose()
  @ApiProperty({ type: Number, description: 'Total number of pages.' })
  readonly pageCount: number;

  @Expose()
  @ApiProperty({ type: Boolean, description: 'Indicates whether a previous page exists.' })
  readonly hasPrevPage: boolean;

  @Expose()
  @ApiProperty({ type: Boolean, description: 'Indicates whether a next page exists.' })
  readonly hasNextPage: boolean;

  /**
   * Creates pagination metadata.
   *
   * @param params Pagination options and item count.
   */
  constructor({ pageOptions, itemCount }: PageMetaDTOParams) {
    this.page = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

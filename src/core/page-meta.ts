/** Constructor parameters for pagination metadata without decorators. */
export interface PageMetaParams {
  /** Requested page and page size. */
  pageOptions: { page: number; perPage: number };
  /** Total number of matching items. */
  itemCount: number;
}

/** Computed pagination metadata without validation or serialization dependencies. */
export class PageMeta {
  readonly page: number;
  readonly perPage: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPrevPage: boolean;
  readonly hasNextPage: boolean;

  /**
   * Computes pagination metadata from validated options and a total count.
   *
   * @param {PageMetaParams} params Pagination options and item count.
   */
  constructor({ pageOptions, itemCount }: PageMetaParams) {
    this.page = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

// src/core/page-meta.ts
var PageMeta = class {
  page;
  perPage;
  itemCount;
  pageCount;
  hasPrevPage;
  hasNextPage;
  /**
   * Computes pagination metadata from validated options and a total count.
   *
   * @param {PageMetaParams} params Pagination options and item count.
   */
  constructor({ pageOptions, itemCount }) {
    this.page = pageOptions.page;
    this.perPage = pageOptions.perPage;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
};

export {
  PageMeta
};
//# sourceMappingURL=chunk-BY2B2WWN.js.map
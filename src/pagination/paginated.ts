import type { PageMetaDTO } from './page-meta.dto.js';

/**
 * Generic paginated result returned by query services.
 */
export type Paginated<T> = {
  /** Items returned for the current page. */
  items: T[];
  /** Total number of items matching the query. */
  itemCount: number;
  /** Pagination metadata for the current query. */
  pageMeta: PageMetaDTO;
};

import type { PageMeta } from './page-meta.js';

/** Public paginated response envelope without decorated DTO classes. */
export type PaginatedResponse<T> = {
  readonly items: T[];
  readonly meta: PageMeta;
};

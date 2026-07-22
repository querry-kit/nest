import { P as PageMetaDTO } from './page-meta.dto-DYUXcvmU.cjs';
export { a as PageMetaDTOParams } from './page-meta.dto-DYUXcvmU.cjs';
export { P as PageOptionsDTO } from './page-options.dto-DbbuIVqj.cjs';

/**
 * DTO for paginated API responses.
 */
declare class PaginatedDTO<T> {
    readonly items: T[];
    readonly meta: PageMetaDTO;
    /**
     * Creates a paginated DTO.
     *
     * @param items Items on the current page.
     * @param meta Pagination metadata.
     */
    constructor(items: T[], meta: PageMetaDTO);
}

/**
 * Generic paginated result returned by query services.
 */
type Paginated<T> = {
    /** Items returned for the current page. */
    items: T[];
    /** Total number of items matching the query. */
    itemCount: number;
    /** Pagination metadata for the current query. */
    pageMeta: PageMetaDTO;
};

export { PageMetaDTO, type Paginated, PaginatedDTO };

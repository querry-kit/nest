import { P as PageOptionsDTO } from './page-options.dto-DbbuIVqj.cjs';

/**
 * Constructor parameters for {@link PageMetaDTO}.
 */
interface PageMetaDTOParams {
    /** Requested page and page size. */
    pageOptions: Pick<PageOptionsDTO, 'page' | 'perPage'>;
    /** Total number of items matching the query. */
    itemCount: number;
}
/**
 * DTO describing pagination metadata for a paginated response.
 */
declare class PageMetaDTO {
    readonly page: number;
    readonly perPage: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPrevPage: boolean;
    readonly hasNextPage: boolean;
    /**
     * Creates pagination metadata.
     *
     * @param params Pagination options and item count.
     */
    constructor({ pageOptions, itemCount }: PageMetaDTOParams);
}

export { PageMetaDTO as P, type PageMetaDTOParams as a };

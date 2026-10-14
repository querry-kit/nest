import { P as PageMeta, a as PageMetaParams } from './page-meta-BP4jzpd4.cjs';

/** Constructor parameters for decorated pagination metadata. */
interface PageMetaDTOParams extends PageMetaParams {
}
/**
 * DTO describing pagination metadata for a paginated response.
 */
declare class PageMetaDTO extends PageMeta {
    readonly page: number;
    readonly perPage: number;
    readonly itemCount: number;
    readonly pageCount: number;
    readonly hasPrevPage: boolean;
    readonly hasNextPage: boolean;
    /**
     * Creates decorated pagination metadata.
     *
     * @param {PageMetaDTOParams} params Pagination options and item count.
     */
    constructor(params: PageMetaDTOParams);
}

export { PageMetaDTO as P, type PageMetaDTOParams as a };

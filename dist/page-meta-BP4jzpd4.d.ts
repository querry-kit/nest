/** Constructor parameters for pagination metadata without decorators. */
interface PageMetaParams {
    /** Requested page and page size. */
    pageOptions: {
        page: number;
        perPage: number;
    };
    /** Total number of matching items. */
    itemCount: number;
}
/** Computed pagination metadata without validation or serialization dependencies. */
declare class PageMeta {
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
    constructor({ pageOptions, itemCount }: PageMetaParams);
}

export { PageMeta as P, type PageMetaParams as a };

export { A as AccessibleWhereResolver, Q as QueryServiceOptions } from './query-service.types-B4FRCOQf.js';
import { Q as QueryService$1 } from './query.service-DzLfjG31.js';
import { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from './dto.js';
import { a as PageMetaDTOParams, P as PageMetaDTO } from './page-meta.dto-45_Je4xL.js';
import './page-meta-BP4jzpd4.js';
import './page-options.dto-DbbuIVqj.js';

/** Query service preserving decorated pagination metadata for existing consumers. */
declare class QueryService<DelegateType extends BaseDelegate = BaseDelegate, TypeMap extends BaseDelegateTypeMap = BaseDelegateTypeMap, Table extends Delegate<DelegateType> = Delegate<DelegateType>, Options extends QueryOptionsMap<TypeMap> = QueryOptionsMap<TypeMap>, Ability = unknown, Subject = unknown> extends QueryService$1<DelegateType, TypeMap, Table, Options, Ability, Subject> {
    /**
     * Creates the legacy decorated pagination metadata.
     *
     * @param {PageMetaDTOParams} params Pagination options and item count.
     * @returns {PageMetaDTO} Decorated pagination metadata.
     */
    protected createPageMeta(params: PageMetaDTOParams): PageMetaDTO;
}

export { QueryService };

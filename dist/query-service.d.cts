export { A as AccessibleWhereResolver, Q as QueryServiceOptions } from './query-service.types-B4FRCOQf.cjs';
import { Q as QueryService$1 } from './query.service-nvP2BQry.cjs';
import { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from './dto.cjs';
import { a as PageMetaDTOParams, P as PageMetaDTO } from './page-meta.dto-Cjfnj1Kt.cjs';
import './page-meta-BP4jzpd4.cjs';
import './page-options.dto-DbbuIVqj.cjs';

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

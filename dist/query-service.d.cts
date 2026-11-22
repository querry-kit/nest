export { A as AccessibleWhereResolver, Q as QueryServiceOptions } from './query-service.types-BZpfvSO5.cjs';
import { QueryService as QueryService$1 } from './core.cjs';
import { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from './dto.cjs';
import { PageMetaDTO } from './index.cjs';
import { PageMetaDTOParams } from './pagination.cjs';
import './page-meta-Bk3LJ893.cjs';
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

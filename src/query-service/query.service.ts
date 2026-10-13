import { Injectable } from '@nestjs/common';

import { QueryService as CoreQueryService } from '../core/query.service.js';
import type { BaseDelegate, BaseDelegateTypeMap, Delegate, QueryOptionsMap } from '../dto/index.js';
import { PageMetaDTO, type PageMetaDTOParams } from '../pagination/page-meta.dto.js';

/** Query service preserving decorated pagination metadata for existing consumers. */
@Injectable()
export class QueryService<
  DelegateType extends BaseDelegate = BaseDelegate,
  TypeMap extends BaseDelegateTypeMap = BaseDelegateTypeMap,
  Table extends Delegate<DelegateType> = Delegate<DelegateType>,
  Options extends QueryOptionsMap<TypeMap> = QueryOptionsMap<TypeMap>,
  Ability = unknown,
  Subject = unknown,
> extends CoreQueryService<DelegateType, TypeMap, Table, Options, Ability, Subject> {
  /**
   * Creates the legacy decorated pagination metadata.
   *
   * @param {PageMetaDTOParams} params Pagination options and item count.
   * @returns {PageMetaDTO} Decorated pagination metadata.
   */
  protected override createPageMeta(params: PageMetaDTOParams): PageMetaDTO {
    return new PageMetaDTO(params);
  }
}

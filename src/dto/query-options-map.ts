import type { AggregateDTO } from './aggregate.dto.js';
import type { CountDTO } from './count.dto.js';
import type { BaseDelegateTypeMap } from './delegate.types.js';
import type { FindByIdDTO } from './find-by-id.dto.js';
import type { FindManyDTO } from './find-many.dto.js';
import type { FindOneDTO } from './find-one.dto.js';
import type { FindUniqueDTO } from './find-unique.dto.js';
import type { QueryDTO } from './query.dto.js';

/**
 * Operation DTO map consumed by {@link QueryService}.
 */
export interface QueryOptionsMap<TM extends BaseDelegateTypeMap> {
  /** DTO accepted by {@link QueryService.findOne}. */
  findOne: FindOneDTO<TM>;
  /** DTO accepted by {@link QueryService.findMany}. */
  findMany: FindManyDTO<TM>;
  /** DTO accepted by {@link QueryService.findById}. */
  findById: FindByIdDTO<TM>;
  /** DTO accepted by {@link QueryService.findUnique}. */
  findUnique: FindUniqueDTO<TM>;
  /** DTO accepted by {@link QueryService.aggregate}. */
  aggregate: AggregateDTO<TM>;
  /** DTO accepted by {@link QueryService.count}. */
  count: CountDTO<TM>;
  /** DTO accepted by {@link QueryService.query}. */
  query: QueryDTO<TM>;
}

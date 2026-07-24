// CASL
export {
  CHECK_POLICIES_KEY,
  CheckPolicies,
  PoliciesGuard,
  createCaslAccessibleWhere,
  filterCaslFields,
} from './casl/index';
export type { CaslAccessibleWhereOptions, CaslDtoFilterOptions, CaslFieldAbility, PolicyHandler } from './casl/index';

// Swagger decorators
export { ApiParamId } from './decorators/params/index';
export { ApiPropertyCreatedAt, ApiPropertyId, ApiPropertyUpdatedAt } from './decorators/properties/index';
export { ApiResourceQuery } from './decorators/query/index';
export type { ApiResourceQueryOptions } from './decorators/query/index';
export { ApiErrorResponses } from './decorators/responses/api-error-responses.decorator';
export { ApiPaginatedResponse } from './decorators/responses/api-paginated-response.decorator';
export type { ApiPaginatedResponseOptions } from './decorators/responses/api-paginated-response.decorator';

// DTOs
export { AggregateDTO, CountDTO, FindByIdDTO, FindManyDTO, FindOneDTO, FindUniqueDTO, QueryDTO } from './dto/index';
export type { BaseDelegate, BaseDelegateTypeMap, Delegate, DelegateTypeMap, QueryOptionsMap } from './dto/index';

// Fields
export {
  ApiFieldsQuery,
  Fields,
  FieldsBadRequestException,
  FieldsExceptionFilter,
  FieldsParser,
  FieldsProjector,
  FieldsQuery,
  FieldsValidator,
  buildFieldSchemaFromDto,
  getDtoFields,
  prepareFieldsQuery,
  relation,
} from './fields/index';
export type {
  ApiFieldsQueryOptions,
  FieldSchema,
  FieldSchemaNode,
  FieldsBadRequestResponse,
  FieldsParseOptions,
  FieldsProjection,
  PrepareFieldsQueryOptions,
  PreparedFieldsQuery,
  SchemaOrDto,
} from './fields/index';

// Pagination
export { PageMetaDTO, PageOptionsDTO, Paginated, PaginatedDTO } from './pagination/index';

// Pipes
export { EmptyStringToNullPipe, QueryTransformPipe } from './pipes/index';

// Query services
export { QueryService } from './query-service/index';
export type { AccessibleWhereResolver, QueryServiceOptions } from './query-service/index';

// Resource queries
export { ResourceQuery } from './resource-query';
export type { ResourceFindByIdOptions, ResourceQueryOptions } from './resource-query.types';

// Utilities
export {
  ValidationUtil,
  diffObjects,
  hasObjectDifferences,
  isBoolean,
  isNumber,
  isObject,
  isPlainObject,
  parseBoolean,
  parseObject,
  parseObjectProperties,
  serializeDecimalValues,
} from './util/index';
export type { ValidationPropertyErrors } from './util/index';
export { parseQueryObject } from './util/query/index';

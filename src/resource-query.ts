import { Fields } from './fields/core/fields';
import { prepareFieldsQuery, type SchemaOrDto } from './fields/index';
import { PaginatedDTO } from './pagination/paginated.dto';
import { preparePaginatedFieldsQuery } from './resource-query-paginated';
import type { ResourceFindByIdOptions, ResourceQueryOptions, ResourceQueryServiceLike } from './resource-query.types';

/**
 * High-level helpers for common resource controller query flows.
 */
export class ResourceQuery {
  /**
   * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
   *
   * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
   * @returns {Promise<PaginatedDTO<TDto>>} Projected paginated response DTO.
   */
  static async query<
    TService extends ResourceQueryServiceLike<TAbility>,
    TQuery extends { fields?: unknown; include?: unknown },
    TSchema extends SchemaOrDto,
    TModel,
    TDto,
    TAbility = unknown,
  >(options: ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<PaginatedDTO<TDto>> {
    const prepared = preparePaginatedFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude,
    });
    const result = await options.service.query<TModel>(prepared.query, options.ability);
    const dtoItems = await Promise.all(result.items.map((item) => options.map(item, options.ability)));
    const response = new PaginatedDTO(dtoItems, result.pageMeta);

    if (prepared.responseProjection) {
      return Fields.project(response, prepared.responseProjection);
    }

    return new PaginatedDTO(Fields.project(dtoItems, prepared.itemProjection), result.pageMeta);
  }

  /**
   * Finds one resource by ID, maps it to a DTO and applies the requested fields projection.
   *
   * @param {ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Find options.
   * @returns {Promise<TDto>} Projected response DTO.
   */
  static async findById<
    TService extends ResourceQueryServiceLike<TAbility>,
    TQuery extends { fields?: unknown; include?: unknown },
    TSchema extends SchemaOrDto,
    TModel,
    TDto,
    TAbility = unknown,
  >(options: ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>): Promise<TDto> {
    const prepared = prepareFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude,
    });
    const model = await options.service.findById<TModel>(options.id, prepared.query, options.ability);
    const dto = await options.map(model, options.ability);

    return Fields.project(dto, prepared.projection);
  }
}

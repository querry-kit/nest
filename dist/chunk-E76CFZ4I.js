import {
  Fields,
  FieldsParser,
  mergeInclude,
  prepareFieldsQuery,
  relation,
  resolveFieldSchema
} from "./chunk-Z3HZQS57.js";

// src/resource-query-paginated.ts
var pageMetaFieldSchema = {
  page: true,
  perPage: true,
  itemCount: true,
  pageCount: true,
  hasPrevPage: true,
  hasNextPage: true
};
function preparePaginatedFieldsQuery(query, schemaOrDto, options) {
  const itemSchema = resolveFieldSchema(schemaOrDto);
  const responseSchema = {
    items: relation(itemSchema),
    meta: relation(pageMetaFieldSchema)
  };
  const parsedProjection = FieldsParser.parse(query.fields);
  if (parsedProjection && (isEmptyProjection(parsedProjection) || hasPaginatedProjectionShape(parsedProjection))) {
    const responseProjection = Fields.parseAndValidate(query.fields, responseSchema, options);
    const itemProjection = getItemProjection(responseProjection);
    const include = itemProjection ? Fields.include(itemProjection, itemSchema, mergeInclude(options?.baseInclude, query.include)) : mergeInclude(options?.baseInclude, query.include);
    return {
      query: {
        ...query,
        ...typeof include === "undefined" ? {} : { include }
      },
      itemProjection,
      responseProjection
    };
  }
  const prepared = prepareFieldsQuery(query, schemaOrDto, options);
  return {
    query: prepared.query,
    itemProjection: prepared.projection,
    responseProjection: void 0
  };
}
function hasPaginatedProjectionShape(projection) {
  return Object.keys(projection).some((key) => key === "items" || key === "meta");
}
function isEmptyProjection(projection) {
  return Object.keys(projection).length === 0;
}
function getItemProjection(projection) {
  const items = projection.items;
  return items && items !== true ? items : void 0;
}

// src/core/resource-query.ts
var ResourceQuery = class {
  /**
   * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
   *
   * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
   * @returns {Promise<PaginatedResponse<TDto>>} Projected paginated response DTO.
   */
  static async query(options) {
    const prepared = preparePaginatedFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude
    });
    const result = await options.service.query(prepared.query, options.ability);
    const dtoItems = await Promise.all(result.items.map((item) => options.map(item, options.ability)));
    const response = this.createResponse(dtoItems, result.pageMeta);
    if (prepared.responseProjection) {
      return Fields.project(response, prepared.responseProjection);
    }
    return this.createResponse(Fields.project(dtoItems, prepared.itemProjection), result.pageMeta);
  }
  /**
   * Finds one resource by ID, maps it to a DTO and applies the requested fields projection.
   *
   * @param {ResourceFindByIdOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Find options.
   * @returns {Promise<TDto>} Projected response DTO.
   */
  static async findById(options) {
    const prepared = prepareFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude
    });
    const model = await options.service.findById(options.id, prepared.query, options.ability);
    const dto = await options.map(model, options.ability);
    return Fields.project(dto, prepared.projection);
  }
  /**
   * Creates a plain paginated response without serialization decorators.
   *
   * @param {T[]} items Mapped and projected response items.
   * @param {PageMeta} meta Pagination metadata from the service.
   * @returns {PaginatedResponse<T>} Public response envelope.
   */
  static createResponse(items, meta) {
    return { items, meta };
  }
};

export {
  ResourceQuery
};
//# sourceMappingURL=chunk-E76CFZ4I.js.map
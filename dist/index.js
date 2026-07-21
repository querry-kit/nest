import {
  EmptyStringToNullPipe,
  QueryTransformPipe
} from "./chunk-JNZKELDM.js";
import {
  ApiFieldsQuery,
  Fields,
  FieldsBadRequestException,
  FieldsExceptionFilter,
  FieldsParser,
  FieldsProjector,
  FieldsQuery,
  FieldsValidator,
  buildFieldSchemaFromDto,
  createRelationSchemaNode,
  getDtoFields,
  mergeInclude,
  prepareFieldsQuery,
  relation,
  resolveFieldSchema
} from "./chunk-6PMKYNMV.js";
import {
  AggregateDTO,
  CountDTO,
  FindByIdDTO,
  FindManyDTO,
  FindOneDTO,
  FindUniqueDTO,
  QueryDTO
} from "./chunk-EZBALGJZ.js";
import "./chunk-IYY6XFAR.js";
import {
  PageOptionsDTO
} from "./chunk-WULMN6U5.js";
import {
  QueryService,
  parseQueryObject
} from "./chunk-EII5MCIE.js";
import {
  createFromPath,
  diffObjects,
  hasObjectDifferences,
  isBoolean,
  isNumber,
  isObject,
  isPlainObject,
  parseBoolean,
  parseObject,
  parseObjectProperties,
  serializeDecimalValues
} from "./chunk-WOJX6DQR.js";
import {
  CHECK_POLICIES_KEY,
  CheckPolicies,
  PoliciesGuard,
  createCaslAccessibleWhere,
  filterCaslFields
} from "./chunk-26ANA2D3.js";
import {
  ApiErrorResponses,
  ApiPaginatedResponse,
  ApiParamId,
  ApiPropertyCreatedAt,
  ApiPropertyId,
  ApiPropertyUpdatedAt,
  ApiResourceQuery
} from "./chunk-T7WTYCE4.js";
import {
  PaginatedDTO
} from "./chunk-MZ5JIS52.js";
import {
  PageMetaDTO
} from "./chunk-V7UTPUGM.js";
import "./chunk-BRKEJJFQ.js";

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

// src/resource-query.ts
var ResourceQuery = class {
  /**
   * Runs a paginated query, maps models to DTOs and applies the requested fields projection.
   *
   * @param {ResourceQueryOptions<TService, TQuery, TSchema, TModel, TDto, TAbility>} options Query options.
   * @returns {Promise<PaginatedDTO<TDto>>} Projected paginated response DTO.
   */
  static async query(options) {
    const prepared = preparePaginatedFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude
    });
    const result = await options.service.query(prepared.query, options.ability);
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
  static async findById(options) {
    const prepared = prepareFieldsQuery(options.query, options.schema, {
      ...options.fields,
      baseInclude: options.include ?? options.fields?.baseInclude
    });
    const model = await options.service.findById(options.id, prepared.query, options.ability);
    const dto = await options.map(model, options.ability);
    return Fields.project(dto, prepared.projection);
  }
};

// src/util/validation.ts
import { getMetadataStorage } from "class-validator";
var ValidationUtil = class {
  /**
   * Returns validation metadata for a specific validation error target.
   *
   * @param {ValidationError} error The validation error to inspect.
   * @returns {ValidationMetadata[]} The metadata entries for the error target.
   */
  static getMetaData(error) {
    if (!error.target) {
      return [];
    }
    return getMetadataStorage().getTargetValidationMetadatas(
      error.target.constructor,
      error.target.constructor.name,
      true,
      false
    );
  }
  /**
   * Processes constraints for a specific validation error.
   *
   * @param {ValidationError} error The error to process.
   * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
   * @returns {ValidationErrorDescription[]} The normalized constraint descriptions.
   */
  static processConstraints(error, metaData) {
    const result = [];
    for (const [key, message] of Object.entries(error.constraints ?? {})) {
      const meta = metaData.find((x) => x.propertyName === error.property && x.name === key);
      if (meta) {
        result.push({
          name: meta.name ?? key,
          constraints: (meta.constraints ?? []).filter(Boolean).map(String)
        });
      } else {
        result.push({ name: key, constraints: [message] });
      }
    }
    return result;
  }
  /**
   * Recursively processes child validation errors into a nested error map.
   *
   * @param {ValidationError[]} children The child errors to process.
   * @param {ValidationMetadata[]} metaData The metadata entries for the error target.
   * @returns {ValidationPropertyErrors} The nested error structure.
   */
  static processChildren(children, metaData) {
    const nestedErrors = {};
    for (const child of children) {
      if (child.constraints) {
        nestedErrors[child.property] = this.processConstraints(child, metaData);
      }
      if (child.children && child.children.length > 0) {
        nestedErrors[child.property] = this.processChildren(child.children, metaData);
      }
    }
    return nestedErrors;
  }
  /**
   * Maps class-validator errors into a structured object representation.
   *
   * @param {ValidationError[]} errors The validation errors to map.
   * @returns {ValidationPropertyErrors} The mapped validation errors.
   */
  static mapValidationErrorsToObject(errors) {
    const result = {};
    for (const error of errors) {
      const metaData = this.getMetaData(error);
      if (error.constraints) {
        result[error.property] = this.processConstraints(error, metaData);
      }
      if (error.children && error.children.length > 0) {
        result[error.property] = this.processChildren(error.children, metaData);
      }
    }
    return result;
  }
};
export {
  AggregateDTO,
  ApiErrorResponses,
  ApiFieldsQuery,
  ApiPaginatedResponse,
  ApiParamId,
  ApiPropertyCreatedAt,
  ApiPropertyId,
  ApiPropertyUpdatedAt,
  ApiResourceQuery,
  CHECK_POLICIES_KEY,
  CheckPolicies,
  CountDTO,
  EmptyStringToNullPipe,
  Fields,
  FieldsBadRequestException,
  FieldsExceptionFilter,
  FieldsParser,
  FieldsProjector,
  FieldsQuery,
  FieldsValidator,
  FindByIdDTO,
  FindManyDTO,
  FindOneDTO,
  FindUniqueDTO,
  PageMetaDTO,
  PageOptionsDTO,
  PaginatedDTO,
  PoliciesGuard,
  QueryDTO,
  QueryService,
  QueryTransformPipe,
  ResourceQuery,
  ValidationUtil,
  buildFieldSchemaFromDto,
  createCaslAccessibleWhere,
  createFromPath,
  createRelationSchemaNode,
  diffObjects,
  filterCaslFields,
  getDtoFields,
  hasObjectDifferences,
  isBoolean,
  isNumber,
  isObject,
  isPlainObject,
  parseBoolean,
  parseObject,
  parseObjectProperties,
  parseQueryObject,
  prepareFieldsQuery,
  relation,
  serializeDecimalValues
};
//# sourceMappingURL=index.js.map
import {
  CHECK_POLICIES_KEY,
  CheckPolicies,
  PoliciesGuard,
  createCaslAccessibleWhere,
  filterCaslFields
} from "./chunk-XMKWILDK.js";
import {
  ApiErrorResponses,
  ApiPaginatedResponse,
  ApiParamId,
  ApiPropertyCreatedAt,
  ApiPropertyId,
  ApiPropertyUpdatedAt,
  ApiResourceQuery
} from "./chunk-NXWUXTS6.js";
import {
  ResourceQuery
} from "./chunk-WLZLZVHK.js";
import {
  EmptyStringToNullPipe,
  QueryTransformPipe
} from "./chunk-7254IUTO.js";
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
  getDtoFields,
  prepareFieldsQuery,
  relation
} from "./chunk-7J44NHH3.js";
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
  PaginatedDTO
} from "./chunk-4ZKRRGLL.js";
import {
  PageOptionsDTO
} from "./chunk-WULMN6U5.js";
import {
  QueryService
} from "./chunk-YAESKMNQ.js";
import {
  parseQueryObject
} from "./chunk-JZBVNNW2.js";
import {
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
} from "./chunk-U7PMJFT5.js";
import {
  PageMetaDTO
} from "./chunk-GKLTIPLP.js";
import "./chunk-BY2B2WWN.js";
import "./chunk-BRKEJJFQ.js";

// src/resource-query.ts
var ResourceQuery2 = class extends ResourceQuery {
  /**
   * Creates the legacy decorated paginated response.
   *
   * @param {T[]} items Mapped and projected response items.
   * @param {PageMetaDTO} meta Pagination metadata from the service.
   * @returns {PaginatedDTO<T>} Decorated response envelope.
   */
  static createResponse(items, meta) {
    return new PaginatedDTO(items, meta);
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
  ResourceQuery2 as ResourceQuery,
  ValidationUtil,
  buildFieldSchemaFromDto,
  createCaslAccessibleWhere,
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
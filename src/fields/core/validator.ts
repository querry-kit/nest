import { FieldSchema, FieldSchemaNode, FieldsProjection } from '../types/schema.types';
import {
  fieldsValidationBadRequest,
  getIncludeChild,
  getNestedIncludeContext,
  hasNestedRelationSelection,
} from '../util/validator.helpers';
import { FieldsBadRequestException } from './bad-request.exception';
import { isRelationSchemaNode } from './schema';

/**
 * Validates parsed field projections against DTO schemas and include rules.
 */
export class FieldsValidator {
  /**
   * Validates field names and nesting against a schema.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {string} [path] The internal traversal path.
   * @returns {void}
   * @throws {FieldsBadRequestException} If an unknown field or invalid nesting is used.
   */
  static validateProjection(projection: FieldsProjection, schema: FieldSchema, path = ''): void {
    for (const key of Object.keys(projection)) {
      const node = schema[key];
      const fieldPath = path ? `${path}.${key}` : key;

      if (!node) {
        throw fieldsValidationBadRequest(`unknown field "${key}"`, fieldPath);
      }

      const projectionNode = projection[key];
      if (projectionNode !== true) {
        if (!isRelationSchemaNode(node)) {
          throw fieldsValidationBadRequest(`field "${key}" does not support nested selections`, fieldPath);
        }

        this.validateProjection(projectionNode, node.fields, fieldPath);
      }
    }
  }

  /**
   * Ensures a projection only contains top-level fields.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @returns {void}
   * @throws {FieldsBadRequestException} If nested selections are present.
   */
  static validateNoNestedSelection(projection: FieldsProjection): void {
    for (const key of Object.keys(projection)) {
      if (projection[key] !== true) {
        throw fieldsValidationBadRequest(`nested selection is not supported on this endpoint (field "${key}")`, key);
      }
    }
  }

  /**
   * Validates that selected relation fields are backed by explicit includes.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {unknown} include The include query object.
   * @param {string} [path] The internal traversal path.
   * @returns {void}
   * @throws {FieldsBadRequestException} If required include values are missing.
   */
  static validateIncludeRequirements(
    projection: FieldsProjection,
    schema: FieldSchema,
    include: unknown,
    path = '',
  ): void {
    for (const key of Object.keys(projection)) {
      const node: FieldSchemaNode = schema[key];
      const projectionNode = projection[key];

      if (!isRelationSchemaNode(node)) {
        continue;
      }

      const fieldPath = path ? `${path}.${key}` : key;
      const includeChild = getIncludeChild(include, key);

      if (typeof includeChild === 'undefined') {
        throw fieldsValidationBadRequest(
          `relation field "${fieldPath}" requires include (missing include.${fieldPath})`,
          fieldPath,
        );
      }

      if (projectionNode === true) {
        continue;
      }

      const nestedInclude = getNestedIncludeContext(includeChild);
      // require explicit nested includes once a selected relation contains relation children.
      if (nestedInclude === true && hasNestedRelationSelection(projectionNode, node.fields)) {
        throw fieldsValidationBadRequest(
          `nested relation selection for "${fieldPath}" requires explicit nested include`,
          fieldPath,
        );
      }

      this.validateIncludeRequirements(
        projectionNode,
        node.fields,
        nestedInclude === true ? undefined : nestedInclude,
        fieldPath,
      );
    }
  }
}

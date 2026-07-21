import { isPlainObject } from '../../util/object/index.js';

import { FieldsBadRequestException } from '../core/bad-request.exception';
import { isRelationSchemaNode } from '../core/schema';
import { FieldSchema, FieldsProjection } from '../types/schema.types';

/**
 * Builds a standardized bad request payload for fields validation.
 *
 * @param {string} details The validation error details.
 * @param {string} [path] The field path that caused the error.
 * @returns {FieldsBadRequestException} The structured bad request exception.
 */
export function fieldsValidationBadRequest(details: string, path?: string): FieldsBadRequestException {
  return new FieldsBadRequestException({
    message: 'Invalid fields query parameter',
    details,
    path,
  });
}

/**
 * Reads one relation node from include data.
 *
 * @param {unknown} include The include query value.
 * @param {string} key The relation key.
 * @returns {unknown} The include child value.
 */
export function getIncludeChild(include: unknown, key: string): unknown {
  if (!isPlainObject(include)) {
    return undefined;
  }

  return include[key];
}

/**
 * Detects whether a projection contains nested relation selections.
 *
 * @param {FieldsProjection} projection The projection tree.
 * @param {FieldSchema} schema The allowed field schema.
 * @returns {boolean} `true` when nested relation selections are present.
 */
export function hasNestedRelationSelection(projection: FieldsProjection, schema: FieldSchema): boolean {
  for (const key of Object.keys(projection)) {
    const projectionNode = projection[key];
    const schemaNode = schema[key];

    if (!schemaNode || !isRelationSchemaNode(schemaNode) || projectionNode === true) {
      continue;
    }

    return true;
  }

  return false;
}

/**
 * Normalizes include child representation for nested traversal.
 *
 * @param {unknown} includeChild The child include node.
 * @returns {unknown} The normalized nested include context.
 */
export function getNestedIncludeContext(includeChild: unknown): unknown {
  if (includeChild === true) {
    return true;
  }

  if (!isPlainObject(includeChild)) {
    return undefined;
  }

  if (isPlainObject(includeChild.include)) {
    return includeChild.include;
  }

  return includeChild;
}

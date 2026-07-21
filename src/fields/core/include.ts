import { parseObject } from '../../util/object/index.js';

import { FieldSchema, FieldsProjection } from '../types/schema.types';
import { isRelationSchemaNode } from './schema';

/**
 * Builds a Prisma-compatible include object from a validated projection.
 *
 * @param {FieldsProjection} projection The parsed fields projection.
 * @param {FieldSchema} schema The allowed DTO schema.
 * @param {unknown} [existing] The existing include query configuration.
 * @returns {Record<string, unknown>} The merged include configuration.
 */
export function buildFieldsInclude(
  projection: FieldsProjection,
  schema: FieldSchema,
  existing?: unknown,
): Record<string, unknown> {
  // normalize dotted query values before merging generated relation includes.
  const parsedExisting = parseObject(existing);
  const current =
    parsedExisting && typeof parsedExisting === 'object' && !Array.isArray(parsedExisting)
      ? (parsedExisting as Record<string, unknown>)
      : {};
  const result: Record<string, unknown> = { ...current };

  for (const key of Object.keys(projection)) {
    const node = schema[key];
    if (!node || !isRelationSchemaNode(node)) {
      continue;
    }

    const selected = projection[key];
    const nested = selected === true ? {} : buildFieldsInclude(selected, node.fields);
    const generated = selected === true || Object.keys(nested).length === 0 ? true : { include: nested };
    const configured = result[key];

    if (configured && typeof configured === 'object' && !Array.isArray(configured) && generated !== true) {
      const configuredObject = configured as Record<string, unknown>;

      // preserve explicit select configuration while adding required relation includes.
      if (
        typeof configuredObject.select === 'object' &&
        configuredObject.select !== null &&
        !Array.isArray(configuredObject.select)
      ) {
        result[key] = {
          ...configuredObject,
          select: {
            ...(configuredObject.select as Record<string, unknown>),
            ...(generated.include as Record<string, unknown>),
          },
        };
        continue;
      }

      // merge into existing include objects without removing caller-provided relations.
      result[key] = {
        ...configuredObject,
        include: {
          ...(typeof configuredObject.include === 'object' &&
          configuredObject.include !== null &&
          !Array.isArray(configuredObject.include)
            ? (configuredObject.include as Record<string, unknown>)
            : {}),
          ...(generated.include as Record<string, unknown>),
        },
      };
    } else if (typeof configured === 'undefined' || (configured === true && generated !== true)) {
      result[key] = generated;
    }
  }

  return result;
}

import { parseObject } from '../../util/object/index.js';

import { FieldSchema, FieldsProjection } from '../types/schema.types';
import { isRelationSchemaNode } from './schema';

/**
 * Merges Prisma-style include values while normalizing query-string objects.
 *
 * @param {unknown} base Include configuration required by the endpoint.
 * @param {unknown} extension Include configuration supplied by the caller.
 * @returns {unknown} The merged include configuration.
 */
export function mergeInclude(base?: unknown, extension?: unknown): unknown {
  const parsedBase = normalizeInclude(base);
  const parsedExtension = normalizeInclude(extension);

  if (!parsedBase) {
    return parsedExtension;
  }

  if (!parsedExtension) {
    return parsedBase;
  }

  return mergeIncludeObjects(parsedBase, parsedExtension);
}

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

function normalizeInclude(include?: unknown): Record<string, unknown> | undefined {
  const parsed = parseObject(include);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return undefined;
  }

  return parsed as Record<string, unknown>;
}

function mergeIncludeObjects(
  base: Record<string, unknown>,
  extension: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(extension)) {
    const current = result[key];
    if (isPlainIncludeObject(current) && isPlainIncludeObject(value)) {
      result[key] = mergeIncludeObjects(current, value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

function isPlainIncludeObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

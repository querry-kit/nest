import { DtoClass, ReflectWithMetadata, SwaggerPropertyMetadata } from '../types/dto-schema.types';
import { FieldSchema } from '../types/schema.types';
import { relation } from './schema';

const SWAGGER_PROPERTIES_ARRAY = 'swagger/apiModelPropertiesArray';
const SWAGGER_PROPERTY = 'swagger/apiModelProperties';

/**
 * Returns DTO field names based on Swagger property metadata.
 *
 * @param {DtoClass} dtoClass The DTO class to inspect.
 * @returns {string[]} The Swagger-decorated DTO field names.
 */
export function getDtoFields(dtoClass: DtoClass): string[] {
  const fields = (Reflect as ReflectWithMetadata).getMetadata?.(SWAGGER_PROPERTIES_ARRAY, dtoClass.prototype) ?? [];

  if (!Array.isArray(fields)) {
    return [];
  }

  return fields.filter((field): field is string => typeof field === 'string').map((field) => field.replace(':', ''));
}

/**
 * Resolves one DTO property type from Swagger or design metadata.
 *
 * @param {DtoClass} dtoClass The DTO class that owns the field.
 * @param {string} field The DTO field name to inspect.
 * @returns {unknown} The resolved field type when metadata is available.
 */
function resolvePropertyType(dtoClass: DtoClass, field: string): unknown {
  const getMetadata = (Reflect as ReflectWithMetadata).getMetadata;
  const swaggerProperty = getMetadata?.(SWAGGER_PROPERTY, dtoClass.prototype, field) as
    SwaggerPropertyMetadata | undefined;

  let resolvedType = swaggerProperty?.type;
  if (typeof resolvedType === 'function') {
    try {
      resolvedType = (resolvedType as () => unknown)();
    } catch {
      // Swagger may store a class constructor directly as the type function.
    }
  }

  if (Array.isArray(resolvedType) && resolvedType.length === 1) {
    resolvedType = resolvedType[0];
  }

  if (typeof resolvedType === 'undefined') {
    resolvedType = getMetadata?.('design:type', dtoClass.prototype, field);
  }

  return resolvedType;
}

/**
 * Checks whether a value is a Swagger-decorated DTO class.
 *
 * @param {unknown} value The value to inspect.
 * @returns {boolean} `true` when the value has Swagger property metadata.
 */
function isDtoClass(value: unknown): value is DtoClass {
  if (typeof value !== 'function') {
    return false;
  }

  const fields = (Reflect as ReflectWithMetadata).getMetadata?.(SWAGGER_PROPERTIES_ARRAY, value.prototype as object);
  return Array.isArray(fields) && fields.length > 0;
}

/**
 * Builds a field schema from a Swagger-decorated DTO class.
 *
 * Nested DTO properties become relation fields. Recursive DTO references are
 * cut off with an empty nested schema.
 *
 * @param {DtoClass} dtoClass The DTO class to inspect.
 * @param {Set<DtoClass>} [visited] The internal recursion guard.
 * @returns {FieldSchema} The generated field schema.
 */
export function buildFieldSchemaFromDto(dtoClass: DtoClass, visited = new Set<DtoClass>()): FieldSchema {
  const schema: FieldSchema = {};

  for (const field of getDtoFields(dtoClass)) {
    const fieldType = resolvePropertyType(dtoClass, field);

    if (isDtoClass(fieldType)) {
      if (visited.has(fieldType)) {
        schema[field] = relation({});
      } else {
        const nextVisited = new Set(visited);
        nextVisited.add(fieldType);
        schema[field] = relation(buildFieldSchemaFromDto(fieldType, nextVisited));
      }
    } else {
      schema[field] = true;
    }
  }

  return schema;
}

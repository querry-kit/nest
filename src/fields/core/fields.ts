import { FieldsParseOptions } from '../types/fields.types';
import { FieldSchema, FieldsProjection } from '../types/schema.types';
import { buildFieldsInclude } from './include';
import { FieldsParser } from './parser';
import { FieldsProjector } from './projector';
import { FieldsValidator } from './validator';

/**
 * High-level facade to parse, validate, include and apply `fields` projections.
 */
export class Fields {
  /**
   * Builds a Prisma-compatible include object from a validated projection.
   *
   * Existing include configuration is preserved and dotted query keys are
   * normalized through the bundled object utilities.
   *
   * @param {FieldsProjection} projection The parsed fields projection.
   * @param {FieldSchema} schema The allowed DTO schema.
   * @param {unknown} [existing] The existing include query configuration.
   * @returns {Record<string, unknown>} The merged include configuration.
   */
  static include(projection: FieldsProjection, schema: FieldSchema, existing?: unknown): Record<string, unknown> {
    return buildFieldsInclude(projection, schema, existing);
  }

  /**
   * Parses and validates a raw `fields` value.
   *
   * @param {unknown} rawFields The raw query parameter value.
   * @param {FieldSchema} schema The allowed DTO field schema.
   * @param {FieldsParseOptions} [options] The validation options.
   * @returns {FieldsProjection | undefined} The parsed projection, an empty projection for an explicit empty string, or `undefined` when omitted.
   * @throws {FieldsBadRequestException} If parsing or validation fails.
   */
  static parseAndValidate(
    rawFields: unknown,
    schema: FieldSchema,
    options?: FieldsParseOptions,
  ): FieldsProjection | undefined {
    const projection = FieldsParser.parse(rawFields);
    if (!projection) {
      return undefined;
    }

    FieldsValidator.validateProjection(projection, schema);

    if (options?.allowNested === false) {
      FieldsValidator.validateNoNestedSelection(projection);
    }

    if (options?.requireIncludeForRelations) {
      FieldsValidator.validateIncludeRequirements(projection, schema, options.include);
    }

    return projection;
  }

  /**
   * Applies a projection to a source value.
   *
   * @param {T} value The source value.
   * @param {FieldsProjection} [projection] The parsed projection tree.
   * @returns {T} The projected value.
   */
  static project<T>(value: T, projection?: FieldsProjection): T {
    return FieldsProjector.project(value, projection);
  }
}

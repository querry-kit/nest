import { FieldsProjection } from '../types/schema.types';
import { FieldsBadRequestException } from './bad-request.exception';
import { FieldsSelectionParser } from './selection-parser';

export const __FieldsParserTest = {
  Parser: FieldsSelectionParser,
};

/**
 * Parses `fields` query parameter values.
 */
export class FieldsParser {
  /**
   * Parses a `fields` value into a projection tree.
   *
   * @param {unknown} value The raw `fields` query parameter value.
   * @returns {FieldsProjection | undefined} The parsed projection tree, an empty projection for an explicit empty string, or `undefined` when omitted.
   * @throws {FieldsBadRequestException} If the value type or syntax is invalid.
   */
  static parse(value: unknown): FieldsProjection | undefined {
    if (typeof value === 'undefined' || value === null) {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new FieldsBadRequestException({
        message: 'Invalid fields query parameter',
        details: 'fields must be a string',
      });
    }

    return new FieldsSelectionParser(value).parse();
  }
}

/**
 * Parsed projection tree from the `fields` query parameter.
 *
 * A `true` node includes the full field value. A nested object includes only
 * the selected child fields.
 */
export interface FieldsProjection {
  [key: string]: FieldsProjection | true;
}

/**
 * One allowed schema node for a field projection.
 */
export type FieldSchemaNode =
  | true
  | {
      relation: true;
      fields: FieldSchema;
    };

/**
 * DTO schema used to validate `fields` projections.
 */
export type FieldSchema = Record<string, FieldSchemaNode>;

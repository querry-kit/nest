/**
 * Validation options for `Fields.parseAndValidate`.
 */
export type FieldsParseOptions = {
  allowNested?: boolean;
  include?: unknown;
  requireIncludeForRelations?: boolean;
};

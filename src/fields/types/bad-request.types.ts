/**
 * Structured response payload for invalid `fields` query parameters.
 */
export type FieldsBadRequestResponse = {
  message: 'Invalid fields query parameter';
  details: string;
  path?: string;
  position?: number;
};

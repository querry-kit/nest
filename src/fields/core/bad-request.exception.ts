import { BadRequestException } from '@nestjs/common';

import { FieldsBadRequestResponse } from '../types/bad-request.types';

/**
 * Error thrown when a `fields` query parameter cannot be parsed or validated.
 */
export class FieldsBadRequestException extends BadRequestException {
  /**
   * Creates a structured fields bad request error.
   *
   * @param {FieldsBadRequestResponse} response The response body details.
   */
  constructor(response: FieldsBadRequestResponse) {
    super(response);
  }
}

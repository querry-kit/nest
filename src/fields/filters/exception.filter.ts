import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { FieldsBadRequestException } from '../core/bad-request.exception';

/**
 * Serializes invalid `fields` query parameter errors as HTTP 400 responses.
 */
@Catch(FieldsBadRequestException)
export class FieldsExceptionFilter implements ExceptionFilter<FieldsBadRequestException> {
  /**
   * Writes the fields error response through the active HTTP adapter response.
   *
   * @param {FieldsBadRequestException} exception The fields parser or validator exception.
   * @param {ArgumentsHost} host The Nest arguments host.
   * @returns {void}
   */
  catch(exception: FieldsBadRequestException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    response.status(statusCode).json({
      statusCode,
      ...(typeof exceptionResponse === 'object' ? exceptionResponse : { message: exceptionResponse }),
    });
  }
}

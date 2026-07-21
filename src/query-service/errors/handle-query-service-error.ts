import { BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { isKnownRequestErrorLike } from './is-known-request-error-like.js';
import { isValidationErrorLike } from './is-validation-error-like.js';

export function handleQueryServiceError(
  error: unknown,
  options?: unknown,
  args?: unknown,
  errorLogger?: Pick<Console, 'error'>,
): never {
  if (isValidationErrorLike(error)) {
    throw new BadRequestException({ message: 'Invalid query.', options, parsedArgs: args });
  }

  if (isKnownRequestErrorLike(error)) {
    throw new BadRequestException({
      message: error.message.split('\n\n\n')[1] ?? 'Invalid data',
      code: error.code,
      data: error.meta,
    });
  }

  if (error instanceof HttpException) {
    throw error;
  }

  errorLogger?.error(error);
  throw new InternalServerErrorException();
}

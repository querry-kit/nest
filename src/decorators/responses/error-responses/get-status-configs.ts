import { HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { ApiErrorResponsesOptions, StatusConfig } from './api-error-responses.types.js';
import { getMessageFromStatusCode } from './get-message-from-status-code.js';

export function getStatusConfigs(options: ApiErrorResponsesOptions): StatusConfig[] {
  return [
    {
      status: HttpStatus.BAD_REQUEST,
      codes: options.badRequestCodes,
      description: options.badRequestDescription,
      decorator: ApiBadRequestResponse,
    },
    {
      status: HttpStatus.UNAUTHORIZED,
      codes: options.unauthorizedCodes,
      description: options.unauthorizedDescription,
      decorator: ApiUnauthorizedResponse,
    },
    {
      status: HttpStatus.FORBIDDEN,
      codes: options.forbiddenCodes,
      description: options.forbiddenDescription,
      decorator: ApiForbiddenResponse,
    },
    {
      status: HttpStatus.NOT_FOUND,
      codes: options.notFoundCodes,
      description: options.notFoundDescription,
      decorator: ApiNotFoundResponse,
    },
    {
      status: HttpStatus.CONFLICT,
      codes: options.conflictCodes,
      description: options.conflictDescription,
      decorator: ApiConflictResponse,
    },
    {
      status: HttpStatus.TOO_MANY_REQUESTS,
      codes: options.tooManyRequestsCodes,
      description: options.tooManyRequestsDescription,
      decorator: ApiTooManyRequestsResponse,
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      codes: options.internalServerErrorCodes,
      description:
        options.internalServerErrorDescription ??
        (options.internalServerError ? getMessageFromStatusCode(HttpStatus.INTERNAL_SERVER_ERROR) : undefined),
      decorator: ApiInternalServerErrorResponse,
    },
  ];
}

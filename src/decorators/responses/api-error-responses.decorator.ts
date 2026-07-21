import { applyDecorators, HttpStatus } from '@nestjs/common';
import type { ApiResponseExamples, ApiResponseNoStatusOptions } from '@nestjs/swagger';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Type representing an error code or a tuple of error code and custom message.
 */
export type Code = string | [string, string];

/**
 * Configuration for a specific HTTP status code response.
 */
type StatusConfig = {
  status: HttpStatus;
  codes?: Code[];
  description?: string;
  decorator: (options?: ApiResponseNoStatusOptions) => MethodDecorator & ClassDecorator;
};

/**
 * Options for ApiErrorResponses decorator.
 */
export type ApiErrorResponsesOptions = {
  //#region 400
  /** Error codes documented as Bad Request examples. */
  badRequestCodes?: Code[];
  /** Description used for the Bad Request response schema. */
  badRequestDescription?: string;
  //#endregion
  //#region 401
  /** Error codes documented as Unauthorized examples. */
  unauthorizedCodes?: Code[];
  /** Description used for the Unauthorized response schema. */
  unauthorizedDescription?: string;
  //#endregion
  //#region 403
  /** Error codes documented as Forbidden examples. */
  forbiddenCodes?: Code[];
  /** Description used for the Forbidden response schema. */
  forbiddenDescription?: string;
  //#endregion
  //#region 404
  /** Error codes documented as Not Found examples. */
  notFoundCodes?: Code[];
  /** Description used for the Not Found response schema. */
  notFoundDescription?: string;
  //#endregion
  //#region 409
  /** Error codes documented as Conflict examples. */
  conflictCodes?: Code[];
  /** Description used for the Conflict response schema. */
  conflictDescription?: string;
  //#endregion
  //#region 429
  /** Error codes documented as Too Many Requests examples. */
  tooManyRequestsCodes?: Code[];
  /** Description used for the Too Many Requests response schema. */
  tooManyRequestsDescription?: string;
  //#endregion
  //#region 500
  /** Includes a generic Internal Server Error response when set to `true`. */
  internalServerError?: boolean;
  /** Error codes documented as Internal Server Error examples. */
  internalServerErrorCodes?: Code[];
  /** Description used for the Internal Server Error response schema. */
  internalServerErrorDescription?: string;
  //#endregion
};

/**
 * Helper to get default message from status code.
 *
 * @param {HttpStatus} statusCode The HTTP status code
 * @returns {string} The default message for the status code
 */
const getMessageFromStatusCode = (statusCode: HttpStatus): string => {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'Bad Request';
    case HttpStatus.UNAUTHORIZED:
      return 'Unauthorized';
    case HttpStatus.FORBIDDEN:
      return 'Forbidden';
    case HttpStatus.NOT_FOUND:
      return 'Not Found';
    case HttpStatus.CONFLICT:
      return 'Conflict';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'Too Many Requests';
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error';
    default:
      return 'Error';
  }
};

/**
 * Helper to get example from error code.
 *
 * @param {HttpStatus} statusCode The HTTP status code
 * @param {Code} code The error code
 * @returns {ApiResponseExamples} The example for the error response
 */
const getExampleFromCode = (statusCode: HttpStatus, code: Code): ApiResponseExamples => {
  const message = Array.isArray(code) ? code[0] : code;
  const error = Array.isArray(code) ? code[1] : getMessageFromStatusCode(statusCode);

  return {
    summary: error,
    value: { statusCode, message, error },
  };
};

/**
 * Helper to get ApiResponse options.
 *
 * @param {HttpStatus} statusCode The HTTP status code
 * @param {Code[]} codes The error codes
 * @param {string} description The description of the error response
 * @returns {ApiResponseNoStatusOptions} The ApiResponse options
 */
const getResponseDecoratorOptions = (
  statusCode: HttpStatus,
  codes?: Code[],
  description?: string,
): ApiResponseNoStatusOptions | undefined => {
  if (!codes && !description) return undefined;
  const normalizedCodes = codes ?? [];

  const message = getMessageFromStatusCode(statusCode);

  // helpers to get example and examples
  const getExample = () => {
    if (normalizedCodes.length > 0) return undefined;
    if (!description) return undefined;
    return {
      summary: description,
      value: {
        statusCode: statusCode,
        message: description,
        error: message,
      },
    };
  };
  const getExamples = () => {
    if (normalizedCodes.length === 0) return undefined;
    return normalizedCodes.reduce<Record<number, ApiResponseExamples>>((acc, code, index) => {
      acc[index] = getExampleFromCode(statusCode, code);
      return acc;
    }, {});
  };

  return {
    description: description ?? message,
    schema: {
      description: description ?? message,
      type: 'object',
      properties: {
        statusCode: { type: 'number', default: statusCode },
        error: { type: 'string', default: message },
        message: { type: 'string' },
      },
    },
    example: getExample(),
    examples: getExamples(),
  };
};

/**
 * Decorator to define multiple error responses for a controller or method.
 *
 * @param {ApiErrorResponsesOptions} options Options to configure error responses.
 * @returns {MethodDecorator & ClassDecorator} The composed response decorator.
 */
export function ApiErrorResponses(options: ApiErrorResponsesOptions = {}): MethodDecorator & ClassDecorator {
  const configs: StatusConfig[] = [
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

  // create decorators from configs
  const decorators = configs
    .filter((c) => c.codes || c.description)
    .map((c) => c.decorator(getResponseDecoratorOptions(c.status, c.codes, c.description)));

  return applyDecorators(...decorators);
}

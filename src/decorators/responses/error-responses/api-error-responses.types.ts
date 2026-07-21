import type { HttpStatus } from '@nestjs/common';
import type { ApiResponseNoStatusOptions } from '@nestjs/swagger';

/**
 * Type representing an error code or a tuple of error code and custom message.
 */
export type Code = string | [string, string];

/**
 * Configuration for a specific HTTP status code response.
 */
export type StatusConfig = {
  status: HttpStatus;
  codes?: Code[];
  description?: string;
  decorator: (options?: ApiResponseNoStatusOptions) => MethodDecorator & ClassDecorator;
};

/**
 * Options for ApiErrorResponses decorator.
 */
export type ApiErrorResponsesOptions = {
  /** Error codes documented as Bad Request examples. */
  badRequestCodes?: Code[];
  /** Description used for the Bad Request response schema. */
  badRequestDescription?: string;
  /** Error codes documented as Unauthorized examples. */
  unauthorizedCodes?: Code[];
  /** Description used for the Unauthorized response schema. */
  unauthorizedDescription?: string;
  /** Error codes documented as Forbidden examples. */
  forbiddenCodes?: Code[];
  /** Description used for the Forbidden response schema. */
  forbiddenDescription?: string;
  /** Error codes documented as Not Found examples. */
  notFoundCodes?: Code[];
  /** Description used for the Not Found response schema. */
  notFoundDescription?: string;
  /** Error codes documented as Conflict examples. */
  conflictCodes?: Code[];
  /** Description used for the Conflict response schema. */
  conflictDescription?: string;
  /** Error codes documented as Too Many Requests examples. */
  tooManyRequestsCodes?: Code[];
  /** Description used for the Too Many Requests response schema. */
  tooManyRequestsDescription?: string;
  /** Includes a generic Internal Server Error response when set to `true`. */
  internalServerError?: boolean;
  /** Error codes documented as Internal Server Error examples. */
  internalServerErrorCodes?: Code[];
  /** Description used for the Internal Server Error response schema. */
  internalServerErrorDescription?: string;
};

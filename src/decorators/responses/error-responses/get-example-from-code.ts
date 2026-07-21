import type { HttpStatus } from '@nestjs/common';
import type { ApiResponseExamples } from '@nestjs/swagger';
import type { Code } from './api-error-responses.types.js';
import { getMessageFromStatusCode } from './get-message-from-status-code.js';

export function getExampleFromCode(statusCode: HttpStatus, code: Code): ApiResponseExamples {
  const message = Array.isArray(code) ? code[0] : code;
  const error = Array.isArray(code) ? code[1] : getMessageFromStatusCode(statusCode);

  return {
    summary: error,
    value: { statusCode, message, error },
  };
}

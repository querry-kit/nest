import type { HttpStatus } from '@nestjs/common';
import type { ApiResponseNoStatusOptions } from '@nestjs/swagger';
import type { Code } from './api-error-responses.types.js';
import { getExamples } from './get-examples.js';
import { getMessageFromStatusCode } from './get-message-from-status-code.js';
import { getSingleExample } from './get-single-example.js';

export function getResponseDecoratorOptions(
  statusCode: HttpStatus,
  codes?: Code[],
  description?: string,
): ApiResponseNoStatusOptions | undefined {
  if (!codes && !description) return undefined;
  const normalizedCodes = codes ?? [];
  const message = getMessageFromStatusCode(statusCode);

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
    example: getSingleExample(statusCode, normalizedCodes, description, message),
    examples: getExamples(statusCode, normalizedCodes),
  };
}

import type { HttpStatus } from '@nestjs/common';
import type { Code } from './api-error-responses.types.js';

export function getSingleExample(
  statusCode: HttpStatus,
  codes: Code[],
  description: string | undefined,
  message: string,
) {
  if (codes.length > 0) return undefined;
  if (!description) return undefined;

  return {
    summary: description,
    value: {
      statusCode,
      message: description,
      error: message,
    },
  };
}

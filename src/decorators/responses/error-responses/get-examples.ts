import type { HttpStatus } from '@nestjs/common';
import type { ApiResponseExamples } from '@nestjs/swagger';
import type { Code } from './api-error-responses.types.js';
import { getExampleFromCode } from './get-example-from-code.js';

export function getExamples(statusCode: HttpStatus, codes: Code[]) {
  if (codes.length === 0) return undefined;

  return codes.reduce<Record<number, ApiResponseExamples>>((acc, code, index) => {
    acc[index] = getExampleFromCode(statusCode, code);
    return acc;
  }, {});
}

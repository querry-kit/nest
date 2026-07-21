import { HttpStatus } from '@nestjs/common';
import { ApiErrorResponses } from '../responses/api-error-responses.decorator.js';
import { ApiResourceQuery } from './api-resource-query.decorator.js';

const apiResponseMetadataKey = 'swagger/apiResponse';

describe('ApiResourceQuery', () => {
  it('merges its generic bad-request example with explicit bad-request codes', () => {
    class TestController {
      query(): void {}
    }

    const descriptor = Object.getOwnPropertyDescriptor(TestController.prototype, 'query')!;
    ApiErrorResponses({ badRequestCodes: ['test'] })(TestController.prototype, 'query', descriptor);
    ApiResourceQuery()(TestController.prototype, 'query', descriptor);

    const responses = Reflect.getMetadata(apiResponseMetadataKey, descriptor.value) as Record<number, unknown>;
    const badRequest = responses[HttpStatus.BAD_REQUEST] as {
      description: string;
      examples: Record<string, { value: { message: string } }>;
    };

    expect(badRequest.description).toContain('Invalid fields syntax');
    expect(badRequest.examples.invalidResourceQuery.value.message).toContain('Invalid fields syntax');
    expect(badRequest.examples.test.value.message).toBe('test');
  });
});

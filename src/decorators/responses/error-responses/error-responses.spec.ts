import { HttpStatus } from '@nestjs/common';

import { getMessageFromStatusCode } from './get-message-from-status-code';
import { getResponseDecoratorOptions } from './get-response-decorator-options';
import { getSingleExample } from './get-single-example';

describe('error response helpers', () => {
  it('uses a generic message for unsupported status codes', () => {
    expect(getMessageFromStatusCode(999 as HttpStatus)).toBe('Error');
  });

  it('omits optional response configuration when no details are supplied', () => {
    expect(getResponseDecoratorOptions(HttpStatus.BAD_REQUEST)).toBeUndefined();
    expect(getSingleExample(HttpStatus.BAD_REQUEST, [], undefined, 'Bad Request')).toBeUndefined();
    expect(getSingleExample(HttpStatus.BAD_REQUEST, ['INVALID'], 'Invalid request', 'Bad Request')).toBeUndefined();
  });
});

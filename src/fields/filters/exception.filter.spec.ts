import { BadRequestException } from '@nestjs/common';

import { FieldsBadRequestException, FieldsExceptionFilter } from '../index';

describe('FieldsExceptionFilter', () => {
  it('uses the NestJS bad request exception base class', () => {
    const exception = new FieldsBadRequestException({
      message: 'Invalid fields query parameter',
      details: 'fields must be a string',
    });

    expect(exception).toBeInstanceOf(BadRequestException);
    expect(exception.getStatus()).toBe(400);
    expect(exception.getResponse()).toEqual({
      message: 'Invalid fields query parameter',
      details: 'fields must be a string',
    });
  });

  it('serializes fields errors as HTTP 400 responses', () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    };
    const exception = new FieldsBadRequestException({
      message: 'Invalid fields query parameter',
      details: 'unknown field "name"',
      path: 'name',
    });

    new FieldsExceptionFilter().catch(exception, host as never);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Invalid fields query parameter',
      details: 'unknown field "name"',
      path: 'name',
    });
  });
});

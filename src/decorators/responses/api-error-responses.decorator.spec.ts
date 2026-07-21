const mockApplyDecorators = jest.fn((...decorators) => decorators);
const mockApiBadRequestResponse = jest.fn((options) => ({
  name: 'bad',
  options,
}));
const mockApiUnauthorizedResponse = jest.fn((options) => ({
  name: 'unauthorized',
  options,
}));
const mockApiForbiddenResponse = jest.fn((options) => ({
  name: 'forbidden',
  options,
}));
const mockApiNotFoundResponse = jest.fn((options) => ({
  name: 'not-found',
  options,
}));
const mockApiConflictResponse = jest.fn((options) => ({
  name: 'conflict',
  options,
}));
const mockApiTooManyRequestsResponse = jest.fn((options) => ({
  name: 'too-many',
  options,
}));
const mockApiInternalServerErrorResponse = jest.fn((options) => ({
  name: 'internal',
  options,
}));

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    applyDecorators: mockApplyDecorators,
  };
});

jest.mock('@nestjs/swagger', () => ({
  ApiBadRequestResponse: mockApiBadRequestResponse,
  ApiUnauthorizedResponse: mockApiUnauthorizedResponse,
  ApiForbiddenResponse: mockApiForbiddenResponse,
  ApiNotFoundResponse: mockApiNotFoundResponse,
  ApiConflictResponse: mockApiConflictResponse,
  ApiTooManyRequestsResponse: mockApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse: mockApiInternalServerErrorResponse,
}));

import { HttpStatus } from '@nestjs/common';
import { ApiErrorResponses } from './api-error-responses.decorator';

describe('ApiErrorResponses decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns no-op decorator when no options are provided', () => {
    const result = ApiErrorResponses({});

    expect(mockApplyDecorators).toHaveBeenCalledWith();
    expect(Array.isArray(result)).toBe(true);
  });

  it('builds configured response decorators with code examples', () => {
    ApiErrorResponses({
      badRequestCodes: ['FileUploadNoFileProvided'],
      unauthorizedCodes: [['AuthInvalidToken', 'Token invalid']],
      forbiddenCodes: ['InsufficientPermissions'],
      notFoundDescription: 'Nothing found',
      conflictCodes: ['ItemAlreadyExists'],
      tooManyRequestsCodes: [['AuthTokenExpired', 'Slow down']],
      internalServerError: true,
    });

    expect(mockApiBadRequestResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Bad Request',
        schema: expect.objectContaining({
          properties: expect.objectContaining({
            statusCode: expect.objectContaining({
              default: HttpStatus.BAD_REQUEST,
            }),
            error: expect.objectContaining({ default: 'Bad Request' }),
          }),
        }),
        examples: expect.objectContaining({
          FileUploadNoFileProvided: expect.objectContaining({
            value: expect.objectContaining({
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'FileUploadNoFileProvided',
            }),
          }),
        }),
      }),
    );

    expect(mockApiUnauthorizedResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        examples: expect.objectContaining({
          AuthInvalidToken: expect.objectContaining({
            summary: 'Token invalid',
            value: expect.objectContaining({
              statusCode: HttpStatus.UNAUTHORIZED,
              message: 'AuthInvalidToken',
              error: 'Token invalid',
            }),
          }),
        }),
      }),
    );

    expect(mockApiNotFoundResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Nothing found',
        example: expect.objectContaining({
          value: expect.objectContaining({
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Nothing found',
            error: 'Not Found',
          }),
        }),
      }),
    );

    expect(mockApiForbiddenResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Forbidden',
      }),
    );

    expect(mockApiConflictResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Conflict',
      }),
    );

    expect(mockApiTooManyRequestsResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Too Many Requests',
        examples: expect.objectContaining({
          AuthTokenExpired: expect.objectContaining({
            summary: 'Slow down',
          }),
        }),
      }),
    );

    expect(mockApiInternalServerErrorResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Internal Server Error',
      }),
    );

    expect(mockApplyDecorators).toHaveBeenCalledTimes(1);
  });

  it('omits unconfigured response decorators', () => {
    ApiErrorResponses({ badRequestDescription: 'Invalid request' });

    expect(mockApiBadRequestResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Invalid request',
      }),
    );
    expect(mockApiUnauthorizedResponse).not.toHaveBeenCalled();
    expect(mockApiForbiddenResponse).not.toHaveBeenCalled();
    expect(mockApiNotFoundResponse).not.toHaveBeenCalled();
    expect(mockApiConflictResponse).not.toHaveBeenCalled();
    expect(mockApiTooManyRequestsResponse).not.toHaveBeenCalled();
    expect(mockApiInternalServerErrorResponse).not.toHaveBeenCalled();
  });
});

const mockApplyDecorators = jest.fn((...decorators) => decorators);
const mockApiOkResponse = jest.fn((options) => ({
  type: 'ok',
  value: options,
}));
const mockGetSchemaPath = jest.fn((model) => `#/components/schemas/${model?.name ?? 'Unknown'}`);

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    applyDecorators: mockApplyDecorators,
  };
});

jest.mock('@nestjs/swagger', () => ({
  ApiOkResponse: mockApiOkResponse,
  getSchemaPath: mockGetSchemaPath,
  ApiProperty: () => () => undefined,
}));

import { ApiPaginatedResponse } from './api-paginated-response.decorator';

class DemoDTO {}

describe('ApiPaginatedResponse decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses default description and schema paths', () => {
    const result = ApiPaginatedResponse({ model: DemoDTO });

    expect(mockGetSchemaPath).toHaveBeenCalledWith(DemoDTO);
    expect(mockGetSchemaPath).toHaveBeenCalledTimes(1);
    expect(mockApiOkResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Paginated items',
        schema: expect.objectContaining({
          properties: expect.objectContaining({
            items: expect.objectContaining({
              type: 'array',
              items: { $ref: '#/components/schemas/DemoDTO' },
            }),
            meta: expect.objectContaining({
              properties: expect.objectContaining({
                page: expect.objectContaining({ type: 'number' }),
                perPage: expect.objectContaining({ type: 'number' }),
                itemCount: expect.objectContaining({ type: 'number' }),
                pageCount: expect.objectContaining({ type: 'number' }),
                hasPrevPage: expect.objectContaining({ type: 'boolean' }),
                hasNextPage: expect.objectContaining({ type: 'boolean' }),
              }),
            }),
          }),
        }),
      }),
    );
    expect(mockApplyDecorators).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
  });

  it('respects custom description', () => {
    ApiPaginatedResponse({ model: DemoDTO, description: 'Custom description' });

    expect(mockApiOkResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Custom description',
      }),
    );
  });
});

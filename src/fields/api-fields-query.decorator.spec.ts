const mockApplyDecorators = jest.fn();
const mockApiQuery = jest.fn();
const mockApiBadRequestResponse = jest.fn();

const actualNestCommon = await import('@nestjs/common');
const actualNestSwagger = await import('@nestjs/swagger');

jest.unstable_mockModule('@nestjs/common', () => ({
  ...actualNestCommon,
  applyDecorators: mockApplyDecorators,
}));

jest.unstable_mockModule('@nestjs/swagger', () => ({
  ...actualNestSwagger,
  ApiQuery: mockApiQuery,
  ApiBadRequestResponse: mockApiBadRequestResponse,
}));

const { ApiFieldsQuery } = await import('./api-fields-query.decorator.js');

describe('ApiFieldsQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('documents default fields validation metadata', () => {
    ApiFieldsQuery();

    expect(mockApiQuery).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'fields', required: false, type: String }),
    );
    expect(mockApiBadRequestResponse).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'The `fields` query parameter is invalid.' }),
    );
    expect(mockApplyDecorators).toHaveBeenCalledTimes(1);
  });

  it('allows Swagger metadata overrides', () => {
    ApiFieldsQuery({
      query: { description: 'Custom field selection.' },
      badRequest: { description: 'Custom validation error.' },
    });

    expect(mockApiQuery).toHaveBeenCalledWith(expect.objectContaining({ description: 'Custom field selection.' }));
    expect(mockApiBadRequestResponse).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Custom validation error.' }),
    );
  });
});

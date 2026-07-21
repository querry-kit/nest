const mockApplyDecorators = jest.fn();
const mockApiQuery = jest.fn();
const mockApiBadRequestResponse = jest.fn();

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  applyDecorators: mockApplyDecorators,
}));

jest.mock('@nestjs/swagger', () => ({
  ...jest.requireActual('@nestjs/swagger'),
  ApiQuery: mockApiQuery,
  ApiBadRequestResponse: mockApiBadRequestResponse,
}));

import { ApiFieldsQuery } from './api-fields-query.decorator';

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

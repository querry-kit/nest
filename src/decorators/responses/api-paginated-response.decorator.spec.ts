import 'reflect-metadata';

const mockApiExtraModels = jest.fn(() => jest.fn());
const mockApiOkResponse = jest.fn(() => jest.fn());
const mockApiProperty = jest.fn(() => jest.fn());
const mockApiPropertyOptional = jest.fn(() => jest.fn());
const mockGetSchemaPath = jest.fn((model: { name: string }) => `#/components/schemas/${model.name}`);

jest.mock('@nestjs/swagger', () => ({
  ApiExtraModels: mockApiExtraModels,
  ApiOkResponse: mockApiOkResponse,
  ApiProperty: mockApiProperty,
  ApiPropertyOptional: mockApiPropertyOptional,
  getSchemaPath: mockGetSchemaPath,
}));

import { PageMetaDTO, PaginatedDTO } from '../../pagination/index.js';
import { ApiPaginatedResponse } from './api-paginated-response.decorator.js';

class BookDTO {}

describe('ApiPaginatedResponse', () => {
  it('creates a Swagger schema for paginated model responses', () => {
    const decorator = ApiPaginatedResponse({ model: BookDTO, description: 'Books' });

    expect(typeof decorator).toBe('function');
    expect(mockApiExtraModels).toHaveBeenCalledWith(PaginatedDTO, PageMetaDTO, BookDTO);
    expect(mockApiOkResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Books',
        schema: {
          allOf: [
            { $ref: '#/components/schemas/PaginatedDTO' },
            {
              properties: {
                items: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/BookDTO' },
                },
                meta: { $ref: '#/components/schemas/PageMetaDTO' },
              },
            },
          ],
        },
      }),
    );
  });

  it('uses the default response description', () => {
    ApiPaginatedResponse({ model: BookDTO });

    expect(mockApiOkResponse).toHaveBeenLastCalledWith(
      expect.objectContaining({
        description: 'Paginated items',
      }),
    );
  });
});

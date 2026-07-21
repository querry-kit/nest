const mockApplyDecorators = jest.fn((...decorators) => decorators);
const mockApiProperty = jest.fn((options) => ({ type: 'property', value: options }));

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    applyDecorators: mockApplyDecorators,
  };
});

jest.mock('@nestjs/swagger', () => ({
  ApiProperty: mockApiProperty,
}));

import { ApiPropertyCreatedAt } from './api-property-created-at.decorator';
import { ApiPropertyUpdatedAt } from './api-property-updated-at.decorator';

describe('timestamp property decorators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses the default created-at description', () => {
    ApiPropertyCreatedAt();

    expect(mockApiProperty).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'The creation date of the item.',
      }),
    );
  });

  it('uses the default updated-at description', () => {
    ApiPropertyUpdatedAt();

    expect(mockApiProperty).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'The updated date of the item.',
      }),
    );
  });

  it('respects custom timestamp property options', () => {
    ApiPropertyCreatedAt({ description: 'Created timestamp', example: '2026-07-20T00:00:00.000Z' });

    expect(mockApiProperty).toHaveBeenCalledWith(
      expect.objectContaining({
        description: 'Created timestamp',
        example: '2026-07-20T00:00:00.000Z',
      }),
    );
  });
});

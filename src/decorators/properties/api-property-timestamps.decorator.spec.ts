const mockApplyDecorators = jest.fn((...decorators) => decorators);
const mockApiProperty = jest.fn((options) => ({ type: 'property', value: options }));

const actualNestCommon = await import('@nestjs/common');

jest.unstable_mockModule('@nestjs/common', () => {
  return {
    ...actualNestCommon,
    applyDecorators: mockApplyDecorators,
  };
});

jest.unstable_mockModule('@nestjs/swagger', () => ({
  ApiProperty: mockApiProperty,
}));

const { ApiPropertyCreatedAt } = await import('./api-property-created-at.decorator.js');
const { ApiPropertyUpdatedAt } = await import('./api-property-updated-at.decorator.js');

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

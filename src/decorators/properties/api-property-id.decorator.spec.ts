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

const mockRandomUUID = jest.fn(() => '00000000-0000-4000-8000-000000000000');

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: {
    randomUUID: mockRandomUUID,
  },
});

const { ApiPropertyId } = await import('./api-property-id.decorator.js');

describe('ApiPropertyId decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses default id metadata', () => {
    const result = ApiPropertyId();

    expect(mockApiProperty).toHaveBeenCalledWith(
      expect.objectContaining({
        example: '00000000-0000-4000-8000-000000000000',
        description: 'The ID of the item.',
      }),
    );
    expect(mockApplyDecorators).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
  });

  it('respects custom property options', () => {
    ApiPropertyId({ example: 'custom-id', description: 'Custom id' });

    expect(mockApiProperty).toHaveBeenCalledWith(
      expect.objectContaining({
        example: 'custom-id',
        description: 'Custom id',
      }),
    );
  });
});

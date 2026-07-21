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

const mockRandomUUID = jest.fn(() => '00000000-0000-4000-8000-000000000000');

Object.defineProperty(globalThis, 'crypto', {
  configurable: true,
  value: {
    randomUUID: mockRandomUUID,
  },
});

import { ApiPropertyId } from './api-property-id.decorator';

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

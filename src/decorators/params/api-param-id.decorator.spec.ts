const mockApplyDecorators = jest.fn((...decorators) => decorators);
const mockApiParam = jest.fn((options) => ({ type: 'param', value: options }));

const actualNestCommon = await import('@nestjs/common');

jest.unstable_mockModule('@nestjs/common', () => {
  return {
    ...actualNestCommon,
    applyDecorators: mockApplyDecorators,
  };
});

jest.unstable_mockModule('@nestjs/swagger', () => ({
  ApiParam: mockApiParam,
}));

const { ApiParamId } = await import('./api-param-id.decorator.js');

describe('ApiParamId decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses default id parameter name', () => {
    const result = ApiParamId({});

    expect(mockApiParam).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'id',
        type: 'string',
        format: 'uuid',
      }),
    );
    expect(mockApplyDecorators).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
  });

  it('uses custom parameter options', () => {
    ApiParamId({ name: 'feedbackId', description: 'Feedback id' });

    expect(mockApiParam).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'feedbackId',
        description: 'Feedback id',
      }),
    );
  });
});

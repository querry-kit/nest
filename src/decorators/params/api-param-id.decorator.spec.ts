const mockApplyDecorators = jest.fn((...decorators) => decorators);
const mockApiParam = jest.fn((options) => ({ type: 'param', value: options }));

jest.mock('@nestjs/common', () => {
  const actual = jest.requireActual('@nestjs/common');
  return {
    ...actual,
    applyDecorators: mockApplyDecorators,
  };
});

jest.mock('@nestjs/swagger', () => ({
  ApiParam: mockApiParam,
}));

import { ApiParamId } from './api-param-id.decorator';

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

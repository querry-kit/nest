import { isDecimalLike, parseQueryObject, serializeDecimalValues } from './index.js';

describe('query utilities', () => {
  it('exposes nest query object parsing aliases', () => {
    expect(
      parseQueryObject({
        'user.name': 'Ada',
        active: 'true',
        items: ['1', 'false'],
        nested: { count: '3' },
      }),
    ).toEqual({
      user: { name: 'Ada' },
      active: true,
      items: [1, false],
      nested: { count: 3 },
    });
  });

  it('serializes decimal-like values recursively', () => {
    expect(
      serializeDecimalValues({
        total: { toNumber: () => 12.5 },
        nested: [{ value: { toNumber: () => 2 } }],
      }),
    ).toEqual({
      total: 12.5,
      nested: [{ value: 2 }],
    });
    expect(serializeDecimalValues(null)).toBeNull();
    expect(serializeDecimalValues(1)).toBe(1);
  });

  it('detects decimal-like values through the nest object utility', () => {
    expect(isDecimalLike({ toNumber: () => 1 })).toBe(true);
    expect(isDecimalLike(new Date())).toBe(false);
  });

  it('delegates decimal serialization when nest exposes decimal utilities', () => {
    jest.isolateModules(() => {
      const serializeFromUtil = jest.fn((value: unknown) => ({ value, source: 'nest' }));
      const isDecimalLikeFromUtil = jest.fn(() => true);

      jest.doMock('../util/object/index.js', () => ({
        isDecimalLike: isDecimalLikeFromUtil,
        serializeDecimalValues: serializeFromUtil,
      }));

      const decimalUtils = require('./decimal.js') as typeof import('./decimal.js');
      const input = { total: { toNumber: () => 1 } };

      expect(decimalUtils.serializeDecimalValues(input)).toEqual({ value: input, source: 'nest' });
      expect(decimalUtils.isDecimalLike(input.total)).toBe(true);
      expect(serializeFromUtil).toHaveBeenCalledWith(input);
      expect(isDecimalLikeFromUtil).toHaveBeenCalledWith(input.total);

      jest.dontMock('../util/object/index.js');
    });
  });
});

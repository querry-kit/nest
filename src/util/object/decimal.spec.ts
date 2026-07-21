import { isDecimalLike, serializeDecimalValues } from './decimal';

describe('decimal object utilities', () => {
  it('detects decimal-like objects', () => {
    expect(isDecimalLike({ toNumber: () => 1 })).toBe(true);
    expect(isDecimalLike(new Date())).toBe(false);
    expect(isDecimalLike({ toNumber: 1 })).toBe(false);
    expect(isDecimalLike(null)).toBe(false);
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
  });

  it('preserves primitive and nullish values', () => {
    expect(serializeDecimalValues(null)).toBeNull();
    expect(serializeDecimalValues(undefined)).toBeUndefined();
    expect(serializeDecimalValues(1)).toBe(1);
    expect(serializeDecimalValues('1')).toBe('1');
  });
});

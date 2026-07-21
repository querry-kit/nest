import { isNumber } from './is-number';

describe('isNumber', () => {
  it('returns true for numbers and numeric strings', () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber('42')).toBe(true);
    expect(isNumber('3.14')).toBe(true);
  });

  it('returns false for values that cannot be converted to numbers', () => {
    expect(isNumber('abc')).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber('   ')).toBe(false);
    expect(isNumber({})).toBe(false);
  });
});

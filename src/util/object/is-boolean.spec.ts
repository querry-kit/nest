import { isBoolean } from './is-boolean';

describe('isBoolean', () => {
  it('returns true for boolean-like values', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean('true')).toBe(true);
    expect(isBoolean('false')).toBe(true);
  });

  it('returns false for non-boolean values', () => {
    expect(isBoolean('yes')).toBe(false);
    expect(isBoolean(42)).toBe(false);
  });
});

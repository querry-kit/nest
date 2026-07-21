import { parseBoolean } from './parse-boolean';

describe('parseBoolean', () => {
  it('returns true for truthy boolean-like values', () => {
    expect(parseBoolean(true)).toBe(true);
    expect(parseBoolean('true')).toBe(true);
    expect(parseBoolean('on')).toBe(true);
    expect(parseBoolean('yes')).toBe(true);
  });

  it('returns false for all other values', () => {
    expect(parseBoolean(false)).toBe(false);
    expect(parseBoolean('false')).toBe(false);
    expect(parseBoolean('off')).toBe(false);
    expect(parseBoolean(1)).toBe(false);
  });
});

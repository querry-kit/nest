import { parse, parseObject } from './parse';

describe('parseObject', () => {
  it('parses numeric strings to numbers', () => {
    expect(parseObject('42')).toBe(42);
    expect(parseObject('3.14')).toBe(3.14);
  });

  it('parses boolean strings', () => {
    expect(parseObject('true')).toBe(true);
    expect(parseObject('false')).toBe(false);
  });

  it('returns null for "null"', () => {
    expect(parseObject('null')).toBeNull();
  });

  it('returns null when parsing literal null object input', () => {
    expect(parseObject(null)).toBeNull();
  });

  it('parses nested objects', () => {
    expect(parseObject({ 'user.name': 'Alice', count: '5' })).toEqual({
      user: { name: 'Alice' },
      count: 5,
    });
  });

  it('parses arrays', () => {
    expect(parseObject(['1', '2'])).toEqual([1, 2]);
  });

  it('parses JSON object and array strings recursively', () => {
    expect(parseObject('{"active":"true","count":"2"}')).toEqual({ active: true, count: 2 });
    expect(parseObject('["1","false"]')).toEqual([1, false]);
  });

  it('preserves invalid JSON-like strings', () => {
    expect(parseObject('{"broken"}')).toBe('{"broken"}');
  });

  it('preserves empty strings', () => {
    expect(parseObject('')).toBe('');
    expect(parseObject('   ')).toBe('   ');
  });

  it('keeps parse as a backwards-compatible alias', () => {
    expect(parse({ page: '1' })).toEqual(parseObject({ page: '1' }));
  });
});

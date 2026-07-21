import { parseFromObject, parseObjectProperties } from './parse-from-object';

describe('parseObjectProperties', () => {
  it('returns null for null input', () => {
    expect(parseObjectProperties(null)).toBeNull();
  });

  it('parses object values recursively', () => {
    expect(parseObjectProperties({ number: '123', boolean: 'true' })).toEqual({
      number: 123,
      boolean: true,
    });
  });

  it('expands dotted keys', () => {
    expect(parseObjectProperties({ 'user.name': 'Ada', count: '5' })).toEqual({
      user: { name: 'Ada' },
      count: 5,
    });
  });

  it('keeps parseFromObject as a backwards-compatible alias', () => {
    expect(parseFromObject({ page: '1' })).toEqual(parseObjectProperties({ page: '1' }));
  });
});

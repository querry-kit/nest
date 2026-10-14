import { parseObjectProperties } from './parse-from-object';

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

  it('merges dotted siblings and replaces conflicting intermediate values', () => {
    expect(
      parseObjectProperties({
        'author.name': 'Ada',
        'author.age': '42',
        profile: null,
        'profile.name': 'Ada',
        scalar: 'old',
        'scalar.name': 'New',
        tags: [],
        'tags.name': 'Admin',
      }),
    ).toEqual({
      author: { name: 'Ada', age: 42 },
      profile: { name: 'Ada' },
      scalar: { name: 'New' },
      tags: { name: 'Admin' },
    });
    expect(parseObjectProperties({ 'author.name': 'Ada', author: 'last' })).toEqual({ author: 'last' });
  });

  it('discards prototype-related paths at every level', () => {
    const input = JSON.parse(
      '{"__proto__":{"isAdmin":true},"constructor.prototype.polluted":true,"safe.prototype.value":true,"user":{"__proto__":{"admin":true},"name":"Ada"}}',
    );
    const result = parseObjectProperties(input);

    expect(result).toEqual({ user: { name: 'Ada' } });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(result.isAdmin).toBeUndefined();
    expect(Object.hasOwn(Object.prototype, 'polluted')).toBe(false);
  });

  it('expands dotted keys', () => {
    expect(parseObjectProperties({ 'user.name': 'Ada', count: '5' })).toEqual({
      user: { name: 'Ada' },
      count: 5,
    });
  });
});

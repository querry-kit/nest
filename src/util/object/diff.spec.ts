import { diffObjects } from './diff';

describe('diffObjects', () => {
  it('returns empty object for identical objects', () => {
    expect(diffObjects({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toEqual({});
  });

  it('captures changed primitive values', () => {
    expect(diffObjects({ age: 30 }, { age: 31 })).toEqual({ age: { old: 30, new: 31 } });
  });

  it('captures added keys', () => {
    expect(diffObjects({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: { old: undefined, new: 2 } });
  });

  it('captures removed keys', () => {
    expect(diffObjects({ a: 1, b: 2 }, { a: 1 })).toEqual({ b: { old: 2, new: undefined } });
  });

  it('recursively diffs nested objects', () => {
    expect(
      diffObjects({ address: { city: 'Berlin', zip: '10115' } }, { address: { city: 'Hamburg', zip: '10115' } }),
    ).toEqual({
      address: { city: { old: 'Berlin', new: 'Hamburg' } },
    });
  });

  it('does not include nested key when nested object is unchanged', () => {
    expect(diffObjects({ address: { city: 'Berlin' } }, { address: { city: 'Berlin' } })).toEqual({});
  });

  it('does not include unchanged nested keys', () => {
    const result = diffObjects({ name: 'John', age: 30 }, { name: 'John', age: 31 });
    expect(result).not.toHaveProperty('name');
    expect(result).toHaveProperty('age');
  });
});

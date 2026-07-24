import { hasObjectDifferences } from './has-differences';

describe('hasObjectDifferences', () => {
  it('returns false for identical primitives', () => {
    expect(hasObjectDifferences(1, 1)).toBe(false);
    expect(hasObjectDifferences('a', 'a')).toBe(false);
  });

  it('returns true for different primitives', () => {
    expect(hasObjectDifferences(1, 2)).toBe(true);
    expect(hasObjectDifferences('a', 'b')).toBe(true);
  });

  it('compares arrays recursively', () => {
    expect(hasObjectDifferences([1, 2], [1, 2])).toBe(false);
    expect(hasObjectDifferences([1, 2], [1, 3])).toBe(true);
    expect(hasObjectDifferences([1], [1, 2])).toBe(true);
  });

  it('compares plain objects recursively', () => {
    expect(hasObjectDifferences({ a: 1 }, { a: 1 })).toBe(false);
    expect(hasObjectDifferences({ a: 1 }, { a: 2 })).toBe(true);
    expect(hasObjectDifferences({ a: 1 }, { b: 1 })).toBe(true);
    expect(hasObjectDifferences({ a: 1, b: 2 }, { a: 1 })).toBe(true);
  });

  it('returns true for different runtime types and fallback values', () => {
    expect(hasObjectDifferences({ a: 1 }, 1 as any)).toBe(true);
    expect(
      hasObjectDifferences(
        () => 'a',
        () => 'a',
      ),
    ).toBe(true);
  });
});

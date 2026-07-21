import { parseQueryObject } from './index.js';

describe('parseQueryObject', () => {
  it('normalizes query-like object values', () => {
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
});

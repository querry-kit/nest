import { QueryTransformPipe } from './query-transform.pipe';

describe('QueryTransformPipe', () => {
  it('parses query objects', () => {
    const pipe = new QueryTransformPipe();
    expect(
      pipe.transform({ page: '1', 'where.name': 'Ada' }, {
        type: 'query',
      } as never),
    ).toEqual({
      page: 1,
      where: { name: 'Ada' },
    });
  });

  it('leaves non-query values unchanged', () => {
    const pipe = new QueryTransformPipe();
    expect(pipe.transform('1', { type: 'param' } as never)).toBe('1');
  });
});

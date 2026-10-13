import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire, registerHooks } from 'node:module';

registerHooks({
  /**
   * Simulates an application without either optional validation package.
   *
   * @param {string} specifier Requested module name.
   * @param {object} context Node resolution context.
   * @param {Function} nextResolve Remaining resolver chain.
   * @returns {object} Resolved module location.
   * @throws {Error} When a validation package is requested.
   */
  resolve(specifier, context, nextResolve) {
    if (/^class-(validator|transformer)(\/|$)/.test(specifier)) {
      throw new Error(`Unexpected optional dependency: ${specifier}`);
    }

    return nextResolve(specifier, context);
  },
});

const require = createRequire(import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
for (const dependency of ['class-validator', 'class-transformer']) {
  assert.equal(manifest.peerDependenciesMeta[dependency].optional, true);
  assert.throws(() => require(dependency), /Unexpected optional dependency/);
}

for (const mode of ['esm', 'cjs']) {
  const core = mode === 'esm' ? await import('@querry-kit/nest/core') : require('@querry-kit/nest/core');
  const schemas = mode === 'esm' ? await import('@querry-kit/nest/zod') : require('@querry-kit/nest/zod');
  const items = [{ id: '1', name: 'Ada' }];
  const delegate = {
    /**
     * Returns the fixture page and verifies pagination reaches the delegate.
     *
     * @param {{ take: number, skip: number }} args Delegate query options.
     * @returns {Promise<object[]>} Fixture items.
     */
    async findMany(args) {
      assert.equal(args.take, 10);
      assert.equal(args.skip, 0);

      return items;
    },

    /**
     * Counts matching fixture items.
     *
     * @returns {Promise<number>} Fixture count.
     */
    async count() {
      return items.length;
    },
  };
  const service = new core.QueryService(delegate);
  const query = schemas.QuerySchema.parse({ page: '1', fields: 'id' });
  const response = await core.ResourceQuery.query({
    service,
    query,
    schema: { id: true, name: true },
    map: (item) => item,
  });

  assert.deepEqual(response.items, [{ id: '1' }]);
  assert.deepEqual(
    { ...response.meta },
    {
      page: 1,
      perPage: 10,
      itemCount: 1,
      pageCount: 1,
      hasPrevPage: false,
      hasNextPage: false,
    },
  );
  assert.equal(schemas.PageMetaSchema.safeParse(response.meta).success, true);
  assert.deepEqual(core.parseQueryObject({ 'where.active': 'true' }), { where: { active: true } });
}

console.log('ESM/CJS core and Zod query flows passed without validation peers.');

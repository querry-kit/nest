# Agent Guidelines

## Project Context

- This repository contains the `@querry-kit/nest` package.
- The package consolidates Query Kit NestJS helpers from the former `nest-util`, `nest-fields-query`, and `nest-prisma-query` packages.
- It is published as a dual ESM/CommonJS TypeScript library built with `tsup`.
- Keep the package small, focused, and dependency-light.
- Prefer existing project conventions over introducing new abstractions.
- Prefer explicit helpers such as `ResourceQuery` and `prepareFieldsQuery` over highly magical controller abstractions unless a change request says otherwise.

## Change Management

- Create a Changeset for every commit, including repository maintenance commits.
- Every committed change must include a Changeset and an appropriate documentation update. Do not create commits for local, temporary, or generated-only work.
- Public API, runtime behavior, package metadata, README, and published documentation changes must update the affected README, VitePress pages, and JSDoc where applicable. Internal changes must update the relevant developer documentation.
- Use the smallest correct SemVer bump:
  - `patch` for fixes, documentation improvements that affect published package metadata, and non-breaking internal improvements.
  - `minor` for new backwards-compatible features.
  - `major` for breaking public API changes.
- Keep Changeset summaries short and user-facing.

## Public API

- Everything exported from `src/index.ts` and configured package subpath exports is public API.
- Public subpaths include `.`, `./object`, `./fields`, `./dto`, `./pagination`, `./query-service`, `./casl`, `./swagger`, `./decorators`, and `./pipes`.
- Do not remove, rename, or change public exports without a `major` Changeset and a migration note.
- Additive exports are usually `minor` changes.
- Bug fixes and documentation-only improvements are usually `patch` changes.
- Keep README, VitePress docs, JSDoc, and tests aligned with public API behavior.

## TypeScript Guidelines

- Use strict, explicit TypeScript where it improves readability or public API clarity.
- Preserve package export compatibility for both `import` and `require` consumers.
- Keep relative source imports compatible with the current TypeScript and Node setup.
- Preserve explicit `.js` extensions in relative imports when required by the package configuration.
- Prefer named exports for public utilities.
- Avoid adding runtime dependencies unless they are clearly necessary.
- Keep public APIs stable and documented.
- Prefer `unknown` over `any` for new implementation code unless the function intentionally accepts or returns any JavaScript value.
- Avoid broad rewrites when a targeted change is enough.
- Keep domain-specific examples in `examples/` dependency-light and runnable without external services unless the task explicitly asks for integration infrastructure.

## JSDoc Guidelines

- Public functions, exported utilities, classes, and public methods should have concise JSDoc.
- `@param` and `@returns` tags must include explicit types.
- JSDoc types must stay semantically aligned with TypeScript signatures.
- Use this format:

```ts
/**
 * Creates an object from a dot-notated path.
 *
 * @param {string} path The path that should be converted into an object.
 * @param {unknown} value The value assigned at the final path segment.
 * @returns {Record<string, unknown>} The created object.
 */
```

- Keep descriptions useful and specific. Do not repeat the parameter name without adding meaning.
- Prefer `unknown` over `any` for new APIs unless the implementation intentionally accepts or returns any value.
- Keep JSDoc in sync with TypeScript signatures.
- For type guards, document the runtime check clearly and use `@returns {boolean}`.
- Use `@returns {void}` only when it improves generated documentation or reader clarity.
- Do not force JSDoc onto trivial private helpers.

## Testing and Verification

- Aim for 100% runtime line coverage. Treat untested executable paths as work to finish, rather than hiding them through coverage collection exclusions; type-only and generated files are outside this target.
- New or changed runtime modules should reach 100% line coverage before they are handed off.
- Run focused tests for the changed area when possible.
- For code changes, run:

```sh
pnpm lint
pnpm build
pnpm test
```

- For package export or build changes, verify both module systems after `pnpm build`:

```sh
node --input-type=module -e "import { parseObject } from '@querry-kit/nest/object'; console.log(parseObject({ page: '1' }))"
node -e "const { parseObject } = require('@querry-kit/nest/object'); console.log(parseObject({ page: '1' }))"
```

- For documentation changes that affect VitePress, run:

```sh
pnpm docs:build
```

- For example app changes, run:

```sh
pnpm examples:check
pnpm examples:build
```

- For workflow changes, validate the YAML structure and run the equivalent local package commands where possible.
- If a verification command cannot be run, mention that explicitly in the final response.

## Git Workflow

- Keep commits scoped and intentional.
- Do not push without an explicit user request.
- After creating and pushing a feature branch, immediately open a draft pull request against the default branch and assign `@tobiaswaelde`.
- When pushing package-relevant changes, ensure a matching Changeset is included in the same pushed branch state.
- Do not revert unrelated user changes.
- Check `git status --short --branch` before committing or pushing when the directory is a Git repository.

## Release Workflow

- Development work should happen on feature branches or `dev`, not directly on `main`.
- Changesets creates or updates release pull requests for versioning and changelog updates.
- Releases should be created through Changesets.
- Keep generated build output such as `dist` out of the main branch.
- Do not publish manually unless the user explicitly asks for it.

## Documentation

- Every committed change needs documentation appropriate to its audience and scope. Keep README and VitePress docs aligned when behavior, installation, release, examples, or development workflows change, and update developer documentation for internal changes.
- Developer documentation should be available in English by default for Query Kit packages.
- Prefer examples that match the published package name:

```ts
import { ResourceQuery, QueryDTO } from '@querry-kit/nest';
import { Fields } from '@querry-kit/nest/fields';
import { parseObject } from '@querry-kit/nest/object';
```

- Keep documentation examples practical and close to the included `examples/books-api` app when possible.
- For VitePress changes, keep navigation, sidebar entries, and linked pages in sync.

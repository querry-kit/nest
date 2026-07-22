# @querry-kit/nest <!-- omit in toc -->

[![npm](https://img.shields.io/npm/v/%40querry-kit%2Fnest?label=npm&logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/@querry-kit/nest)
[![npm downloads](https://img.shields.io/npm/dm/%40querry-kit%2Fnest?label=downloads&logo=npm&logoColor=white&style=for-the-badge)](https://www.npmjs.com/package/@querry-kit/nest)
[![license](https://img.shields.io/npm/l/%40querry-kit%2Fnest?label=license&style=for-the-badge)](LICENSE)
[![node](https://img.shields.io/node/v/%40querry-kit%2Fnest?label=node&logo=nodedotjs&logoColor=white&style=for-the-badge)](package.json)
[![bundle size](https://img.shields.io/bundlephobia/minzip/%40querry-kit/nest?label=size&logo=webpack&logoColor=white&style=for-the-badge)](https://bundlephobia.com/package/@querry-kit/nest)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![Buy Me a Coffee](https://img.shields.io/badge/buy_me_a_coffee-tobiaswaelde-ffdd00?logo=buymeacoffee&logoColor=000000&style=for-the-badge)](https://www.buymeacoffee.com/tobiaswaelde)

[![build](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/build.yml?branch=main&label=build&logo=githubactions&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/build.yml)
[![test](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/test.yml?branch=main&label=test&logo=jest&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/test.yml)
[![coverage](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/test.yml?branch=main&label=coverage&logo=jest&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/test.yml)
[![lint](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/lint.yml?branch=main&label=lint&logo=eslint&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/lint.yml)
[![docs](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/docs.yml?branch=main&label=docs&logo=vitepress&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/docs.yml)
[![changesets](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/changesets.yml?branch=main&label=changesets&logo=changesets&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/changesets.yml)
[![npm publish](https://img.shields.io/github/actions/workflow/status/querry-kit/nest/release.yml?branch=main&label=npm%20publish&logo=githubactions&logoColor=white&style=for-the-badge)](https://github.com/querry-kit/nest/actions/workflows/release.yml)

Consolidated NestJS helpers for Query Kit APIs: fields projection, Prisma-style query services, CASL policies, OpenAPI decorators, pipes, pagination DTOs, and object utilities.

📖 Documentation: https://querry-kit.github.io/nest/

## 🌐 Querry Kit Ecosystem

The [Querry Kit overview](https://querry-kit.github.io/querry-kit/) connects the three main repositories:

- [`@querry-kit/nest`](https://github.com/querry-kit/nest) for the Query Kit-compatible NestJS API and controller patterns.
- [`@querry-kit/nuxt`](https://github.com/querry-kit/nuxt) for typed API clients and headless Vue/Nuxt data primitives.
- [`@querry-kit/nuxt-ui`](https://github.com/querry-kit/nuxt-ui) for Nuxt UI integrations built on these primitives.

It will also contain the complete API-and-webapp example that shows the packages working together end to end.

## 📚 Table of Contents <!-- omit in toc -->

- [🌐 Querry Kit Ecosystem](#-querry-kit-ecosystem)
- [📦 Install](#-install)
- [🚀 Release Workflow](#-release-workflow)
- [🧩 Usage](#-usage)
- [🔐 CASL](#-casl)
- [🎯 Fields](#-fields)
- [Example API](#example-api)
- [📖 Documentation](#-documentation)
- [🛠 Development](#-development)

## 📦 Install

```sh
pnpm add @querry-kit/nest
pnpm add @nestjs/common @nestjs/core @nestjs/swagger class-transformer class-validator reflect-metadata
```

For the optional CASL adapter:

```sh
pnpm add @casl/ability @casl/prisma
```

The current package version is published on npm. npm is the primary distribution channel.

GitHub release tags remain available as a fallback:

```sh
pnpm add github:querry-kit/nest#v0.0.1
```

## 🚀 Release Workflow

Releases are driven by Changesets and GitHub Actions. The `main` branch does not contain committed `dist` files; it only contains source, documentation, examples, and workflow configuration.

Package-visible changes should include a changeset:

```sh
pnpm changeset
```

When changes land on `main`, the `changesets` workflow creates or updates a release PR. That PR contains the version bump and changelog updates produced by:

```sh
pnpm changeset version
```

The npm publish workflow uses npm Trusted Publishing through GitHub Actions OIDC. The npm package must be connected to this repository and workflow in the npm package publishing settings:

- Repository: `querry-kit/nest`
- Workflow file: `release.yml`
- Environment: unset

After the release PR is merged, the `npm publish` workflow runs for the version/changelog changes. It runs package checks, builds `dist` in CI, publishes `@querry-kit/nest` to npm, tags the release commit as `vX.Y.Z`, and creates a GitHub Release.

Consumers should install from npm:

```sh
pnpm add @querry-kit/nest
```

## 🧩 Usage

`ResourceQuery` covers the common controller flow: parse optional `fields`, merge endpoint-required includes with client `include` values, generate Prisma includes for selected relations, call a `QueryService`, map models to DTOs, and project the response.

```ts
import { Get, Query, Req } from '@nestjs/common';
import { ApiErrorResponses, ApiPaginatedResponse, ApiResourceQuery, QueryDTO, ResourceQuery } from '@querry-kit/nest';

@Get()
@ApiResourceQuery()
@ApiPaginatedResponse({ model: CustomerDTO })
@ApiErrorResponses({ badRequestDescription: 'Invalid query parameter.' })
async query(@Req() req: AuthRequest, @Query() query: QueryDTO<CustomerTypeMap>) {
  return ResourceQuery.query({
    service: this.customersService,
    query,
    schema: CustomerDTO,
    ability: req.ability,
    map: (customer, ability) => CustomerDTO.fromModel(customer, ability),
  });
}
```

Create resource services with `QueryService` and a Prisma-compatible delegate:

```ts
import { Injectable } from '@nestjs/common';
import { QueryService, type BaseDelegateTypeMap } from '@querry-kit/nest';
import { Prisma, PrismaService } from '../prisma';

interface CustomerTypeMap extends BaseDelegateTypeMap {
  select: Prisma.CustomerSelect;
  include: Prisma.CustomerInclude;
  whereInput: Prisma.CustomerWhereInput;
  orderByWithRelationInput: Prisma.CustomerOrderByWithRelationInput;
  whereUniqueInput: Prisma.CustomerWhereUniqueInput;
  scalarFieldEnum: Prisma.CustomerScalarFieldEnum;
}

@Injectable()
export class CustomersService extends QueryService<typeof PrismaService.prototype.customer, CustomerTypeMap> {
  constructor(prisma: PrismaService) {
    super(prisma.customer);
  }
}
```

Focused subpaths are available for smaller imports:

```ts
import { createCaslAccessibleWhere, filterCaslFields } from '@querry-kit/nest/casl';
import { ApiResourceQuery } from '@querry-kit/nest/decorators';
import { Fields } from '@querry-kit/nest/fields';
import { parseObject } from '@querry-kit/nest/object';
import { QueryService } from '@querry-kit/nest/query-service';
```

## 🔐 CASL

CASL is optional. Pass `ability` only when the endpoint should merge an authorization-aware `where` clause through `QueryService`; omit it for APIs that do not use CASL.

```ts
import { createCaslAccessibleWhere } from '@querry-kit/nest/casl';

super(prisma.customer, {
  subject: 'Customer',
  accessibleWhere: createCaslAccessibleWhere({ action: 'read' }),
});
```

When an ability is passed to `query`, the service combines the CASL where clause with user filters as `{ AND: [accessibleWhere, parsedWhere] }`.

For field-level response permissions, filter the completed DTO without mutating it:

```ts
return filterCaslFields(dto, 'Customer', ability);
```

The helper uses the `read` action by default. Pass `{ action: RoleAction.READ }` when an application uses uppercase or enum-backed actions. It filters serialized DTO fields only; keep passing the ability to `QueryService` to constrain database reads too.

## 🎯 Fields

`fields` is optional by default. When omitted, Query Kit returns the complete DTO response. When present, it validates the syntax and selected fields, adds required relation includes, and projects the returned DTOs. Outer braces are optional, so `{id,title}` is equivalent to `id,title`.

```txt
GET /books?fields=id,title
GET /books?fields={id,title}
GET /books?fields=items{id,title},meta{page,perPage,itemCount,pageCount}
GET /books?fields=items{},meta{page}
```

An explicit empty value (`?fields=`) or empty outer selection (`?fields={}`) returns `{}`. Empty nested selections are also valid: `items{}` produces empty item objects, while `meta{page}` keeps only the requested page metadata. A value containing only whitespace remains invalid.

Use `prepareFieldsQuery` directly when a controller needs custom service orchestration:

```ts
import { Fields, prepareFieldsQuery } from '@querry-kit/nest/fields';

const prepared = prepareFieldsQuery({
  fields: query.fields,
  include: query.include,
  schema: BookDTO,
  requiredInclude: { author: true },
});

const { items, pageMeta } = await booksService.query({ ...query, include: prepared.include });

return {
  items: Fields.project(items.map(BookDTO.fromModel), prepared.projection),
  meta: Fields.project(pageMeta, prepared.metaProjection),
};
```

## Example API

A small in-memory NestJS example lives in [`examples/books-api`](examples/books-api/). It uses books and authors to show relation includes, fields projection, pagination metadata, CASL-aware controller flow, query transformation, and OpenAPI documentation.

```sh
pnpm examples:check
pnpm examples:build
```

## 📖 Documentation

- [Getting Started](https://querry-kit.github.io/nest/guide/getting-started)
- [Example App](https://querry-kit.github.io/nest/guide/example-app)
- [CRUD Controller](https://querry-kit.github.io/nest/guide/crud-controller)
- [Fields](https://querry-kit.github.io/nest/api/fields/)
- [Query Service](https://querry-kit.github.io/nest/api/query-service)
- [DTOs and Pagination](https://querry-kit.github.io/nest/api/dtos-pagination)
- [OpenAPI Decorators](https://querry-kit.github.io/nest/api/openapi)
- [CASL](https://querry-kit.github.io/nest/api/casl)
- [API Reference](https://querry-kit.github.io/nest/api/)

Run the VitePress documentation locally:

```sh
pnpm docs:dev
```

Build the documentation:

```sh
pnpm docs:build
```

## 🛠 Development

```sh
pnpm install
pnpm lint
pnpm check
pnpm test
pnpm test:coverage
pnpm build
pnpm examples:check
pnpm examples:build
pnpm docs:build
```

`pnpm test:coverage` collects all source files, prints the coverage summary, and writes HTML and LCOV reports to `coverage/`. GitHub Actions runs the same command and retains the report as a workflow artifact.

# Books API Example <!-- omit in toc -->

A small in-memory NestJS API that demonstrates the consolidated `@querry-kit/nest` flow.

See the [package README](../../README.md) for installation, package usage, and the full documentation index.

## 📚 Table of Contents <!-- omit in toc -->

- [🚀 Run](#-run)
- [🧩 Usage](#-usage)
- [📖 Documentation](#-documentation)

## 🚀 Run

```sh
pnpm examples:check
pnpm examples:build
pnpm examples:start
```

Open `http://localhost:3000/docs` after starting the app. Use `PORT=3100 pnpm examples:start` when port 3000 is already in use.

## 🧩 Usage

The example includes:

- `ResourceQuery.query` and `ResourceQuery.findById`.
- Optional `fields` projection with generated relation includes.
- Paginated envelope projection such as `fields=items{id,title},meta{page,itemCount}`.
- `QueryService` with a CASL Prisma `accessibleWhere` resolver.
- Conditional write permissions checked against the concrete resource.
- `CheckPolicies`, `PoliciesGuard`, `ApiResourceQuery`, `ApiPaginatedResponse`, `ApiErrorResponses`, `ApiParamId`, and `QueryTransformPipe`.

Try fields projection and nested relations:

```sh
curl -g 'http://localhost:3000/books?fields=id,title,author{name},tags{name}'
curl -g 'http://localhost:3000/books?fields=items{id,title},meta{page,perPage,itemCount,pageCount}'
curl -g 'http://localhost:3000/books/book-1?fields=id,title,author{name,books{title}}'
```

The demo ability can read only published books, so `QueryService` applies the same CASL Prisma filter before fetching and counting rows. It can update only draft books. Therefore `PATCH /books/book-3` is allowed, while updates to either published book return HTTP 403 even though the route-level policy itself permits updates.

```sh
curl -X PATCH 'http://localhost:3000/books/book-3?fields=id,title,published' \
  -H 'content-type: application/json' \
  -d '{"title":"Updated draft authorization rules"}'
```

## 📖 Documentation

The controller includes `GET`, `POST`, `PATCH`, and `DELETE` routes so the complete CRUD shape is visible in one file. Every route accepts optional `fields`; invalid field names and invalid demo `select` or `include` keys return HTTP 400. Browse the generated OpenAPI documentation at `http://localhost:3000/docs`.

# Books API Example

Small in-memory NestJS API showing the consolidated `@querry-kit/nest` flow:

- `ResourceQuery.query` and `ResourceQuery.findById`.
- optional `fields` projection with generated relation includes.
- paginated envelope projection such as `fields=items{id,title},meta{page,itemCount}`.
- `QueryService` with an authorization-aware `accessibleWhere` resolver.
- `CheckPolicies`, `PoliciesGuard`, `ApiResourceQuery`, `ApiPaginatedResponse`, `ApiErrorResponses`, and `ApiParamId`.
- `QueryTransformPipe` and OpenAPI documentation.

## Run

```sh
pnpm examples:check
pnpm examples:build
pnpm examples:start
```

Then open `http://localhost:3000/docs`. Use `PORT=3100 pnpm examples:start` when port 3000 is already in use.

## Try

```sh
curl -g 'http://localhost:3000/books?fields=id,title,author{name},tags{name}'
```

```sh
curl -g 'http://localhost:3000/books?fields=items{id,title},meta{page,perPage,itemCount,pageCount}'
```

```sh
curl -g 'http://localhost:3000/books/book-1?fields=id,title,author{name,books{title}}'
```

The demo request ability allows only published books, so unpublished rows are filtered by `QueryService`.

The controller includes `GET`, `POST`, `PATCH`, and `DELETE` routes so the full CRUD shape is visible in one file. Every route accepts optional `fields`; invalid field names and invalid demo `select`/`include` keys return HTTP 400.

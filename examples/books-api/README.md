# Books API Example

Small in-memory NestJS API showing the consolidated `@querry-kit/nest` flow:

- `ResourceQuery.query` and `ResourceQuery.findById`.
- `fields` projection with generated relation includes.
- `QueryService` with an authorization-aware `accessibleWhere` resolver.
- `CheckPolicies`, `PoliciesGuard`, `ApiPaginatedResponse`, `ApiErrorResponses`, and `ApiParamId`.
- `QueryTransformPipe` and Swagger documentation.

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
curl -g 'http://localhost:3000/books/book-1?fields=id,title,author{name,books{title}}'
```

The demo request ability allows only published books, so unpublished rows are filtered by `QueryService`.

The controller includes `GET`, `POST`, `PATCH`, and `DELETE` routes so the full CRUD shape is visible in one file.

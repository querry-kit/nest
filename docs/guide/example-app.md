---
description: 'Run and inspect the Books API example for @querry-kit/nest.'
---

# Example App

The repository includes a small in-memory NestJS app under `examples/books-api`. It is modeled after a real resource controller flow, but uses neutral `Book`, `Author`, and `Tag` data instead of application-specific CRM models.

## What It Shows

- `ResourceQuery.query` for paginated list endpoints.
- `ResourceQuery.findById` for detail endpoints.
- DTO-backed `fields` validation and projection.
- generated includes for `author`, nested `author.books`, and `tags`.
- `QueryService` with an authorization-aware `accessibleWhere` resolver.
- `CheckPolicies`, `PoliciesGuard`, `ApiPaginatedResponse`, `ApiErrorResponses`, and `ApiParamId`.
- `QueryTransformPipe`, `FieldsExceptionFilter`, and Swagger setup.
- a complete CRUD controller with `GET`, `POST`, `PATCH`, and `DELETE`.

## Run

```sh
pnpm examples:check
pnpm examples:build
pnpm examples:start
```

Swagger is available at:

```txt
http://localhost:3000/docs
```

Use a different port when `3000` is already taken:

```sh
PORT=3100 pnpm examples:start
```

## Routes

Query published books:

```sh
curl -g 'http://localhost:3000/books?fields=id,title,author{name},tags{name}'
```

Find one book and request nested author books:

```sh
curl -g 'http://localhost:3000/books/book-1?fields=id,title,author{name,books{title}}'
```

Create a book:

```http
POST /books
Content-Type: application/json

{
  "title": "Composable Nest APIs",
  "isbn": "978-0000000004",
  "authorId": "author-ada",
  "tagIds": ["tag-nest", "tag-api"]
}
```

Delete a book:

```http
DELETE /books/book-2
```

Update a book:

```http
PATCH /books/book-2
Content-Type: application/json

{
  "title": "Typed Prisma Services, 2nd Edition",
  "tagIds": ["tag-prisma", "tag-api"]
}
```

## Source Layout

| File | Purpose |
| ---- | ------- |
| `book.dto.ts` | Public DTOs and in-memory model types. |
| `book.delegate.ts` | Prisma-like in-memory delegate consumed by `QueryService`. |
| `books.service.ts` | `QueryService` subclass with demo access filtering. |
| `books.controller.ts` | CRM-style controller using `ResourceQuery` and decorators. |
| `main.ts` | Swagger, fields errors, and query transformation bootstrap. |

See the complete [NestJS main.ts](/guide/main-bootstrap) and [CRUD Controller](/guide/crud-controller) examples for copyable versions.

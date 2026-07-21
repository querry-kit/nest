---
description: 'OpenAPI decorators for resource queries, pagination responses, and common error responses.'
---

# OpenAPI Decorators

Query Kit includes OpenAPI decorators for common NestJS API metadata.

```ts
import { ApiErrorResponses, ApiPaginatedResponse, ApiResourceQuery } from '@querry-kit/nest';
```

`ApiResourceQuery()` documents list query parameters: `fields`, `page`, `perPage`, `select`, `include`, `where`, `orderBy`, and `distinct`. It also adds the `invalidResourceQuery` example to the HTTP 400 response for invalid fields syntax, unknown fields, invalid include/select, or invalid query values.

```ts
@Get()
@ApiResourceQuery()
@ApiPaginatedResponse({ model: UserDTO })
findMany() {}
```

`ApiPaginatedResponse({ model })` documents a `PaginatedDTO<T>` response with `items` and `meta`.

```ts
@ApiPaginatedResponse({ model: UserDTO, description: 'Users' })
findMany() {}
```

`ApiErrorResponses(options?)` documents common error responses for `400`, `401`, `403`, `404`, `409`, `429`, and optionally `500`. Its code examples merge with the generic resource-query example, so Swagger UI can present both causes under one 400 response.

```ts
@ApiErrorResponses({
  badRequestCodes: ['test'],
  notFoundDescription: 'User not found',
  internalServerError: true,
})
findOne() {}
```

The generated 400 response contains both `invalidResourceQuery` and `test` examples, so both names are selectable in Swagger UI.

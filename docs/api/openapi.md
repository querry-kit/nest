---
description: 'OpenAPI decorators for resource queries, pagination responses, and common error responses.'
---

# OpenAPI Decorators

Query Kit includes OpenAPI decorators for common NestJS API metadata.

```ts
import { ApiErrorResponses, ApiPaginatedResponse, ApiResourceQuery } from '@querry-kit/nest';
```

`ApiResourceQuery()` documents list query parameters: `fields`, `page`, `perPage`, `select`, `include`, `where`, `orderBy`, and `distinct`. It also adds a 400 response for invalid fields syntax, unknown fields, invalid include/select, or invalid query values.

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

`ApiErrorResponses(options?)` documents common error responses for `400`, `401`, `403`, `404`, `409`, `429`, and optionally `500`.

```ts
@ApiErrorResponses({
  badRequestCodes: ['ValidationFailed'],
  notFoundDescription: 'User not found',
  internalServerError: true,
})
findOne() {}
```

---
description: 'Decorators, pipes, Swagger helpers, validation helpers, and object utilities.'
---

# Decorators, Pipes, Utilities

This package includes the small NestJS utilities that were previously split into focused packages.

## Swagger Decorators

```ts
import { ApiErrorResponses, ApiPaginatedResponse, ApiParamId, ApiResourceQuery } from '@querry-kit/nest';
```

`ApiResourceQuery()` documents the common list query parameters: `fields`, `page`, `perPage`, `select`, `include`, `where`, `orderBy`, and `distinct`. It also adds a 400 response for invalid fields syntax, unknown fields, invalid include/select, or invalid query values.

```ts
@ApiResourceQuery()
@ApiPaginatedResponse({ model: UserDTO })
findMany() {}
```

`ApiPaginatedResponse({ model })` documents a `PaginatedDTO<T>` response with `items` and `meta` properties.

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

`ApiParamId` documents UUID route parameters. Property decorators such as `ApiPropertyId`, `ApiPropertyCreatedAt`, and `ApiPropertyUpdatedAt` cover common DTO metadata.

## Pipes

`QueryTransformPipe` normalizes query objects with `parseObject`.

```ts
app.useGlobalPipes(new QueryTransformPipe());
```

`EmptyStringToNullPipe` converts empty strings in request bodies to `null`, including nested objects and arrays. Non-body arguments are returned unchanged.

## Object Utilities

```ts
import { diffObjects, hasObjectDifferences, parseObject, serializeDecimalValues } from '@querry-kit/nest/object';
```

`parseObject` converts common query-string values into JavaScript values.

```ts
parseObject({
  page: '1',
  enabled: 'true',
  deletedAt: 'null',
  tags: ['1', '2'],
  orderBy: '{"createdAt":"desc"}',
  'user.name': 'Ada',
});
```

`serializeDecimalValues` recursively converts Decimal-like objects with a `toNumber()` method into numbers. `diffObjects` and `hasObjectDifferences` compare nested objects and arrays.

## Validation Utility

`ValidationUtil.mapValidationErrorsToObject(errors)` maps class-validator errors into an object keyed by property name. It does not run validation itself.

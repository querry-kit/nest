---
description: 'Query and request body pipes for NestJS APIs.'
---

# Pipes

Query Kit exports small pipes for common request normalization.

```ts
import { EmptyStringToNullPipe, QueryTransformPipe } from '@querry-kit/nest/pipes';
```

`QueryTransformPipe` normalizes query objects with the bundled object parser.

```ts
app.useGlobalPipes(new QueryTransformPipe());
```

It converts common query-string values into Prisma-friendly JavaScript values:

```ts
{
  page: '1',
  enabled: 'true',
  deletedAt: 'null',
  orderBy: '{"createdAt":"desc"}',
  'user.name': 'Ada',
}
```

becomes:

```ts
{
  page: 1,
  enabled: true,
  deletedAt: null,
  orderBy: { createdAt: 'desc' },
  user: { name: 'Ada' },
}
```

`EmptyStringToNullPipe` converts empty strings in request bodies to `null`, including nested objects and arrays. Non-body arguments are returned unchanged.

---
description: 'API overview for @querry-kit/nest.'
---

# API Reference

`@querry-kit/nest` exports a consolidated public API from the package root and focused subpaths.

```ts
import {
  ApiErrorResponses,
  ApiPaginatedResponse,
  ApiResourceQuery,
  Fields,
  QueryDTO,
  QueryService,
  ResourceQuery,
  prepareFieldsQuery,
} from '@querry-kit/nest';

import { parseObject } from '@querry-kit/nest/object';
import { createCaslAccessibleWhere } from '@querry-kit/nest/casl';
```

## Main Areas

| Area | Use for |
| ---- | ------- |
| `ResourceQuery` | Common controller read flows with fields, includes, service calls, DTO mapping, and projection. |
| `Fields` | Low-level parsing, validation, include generation, and response projection. |
| `QueryService` | Prisma-compatible read operations, pagination, query normalization, and error mapping. |
| DTOs and pagination | Controller query DTOs and `PaginatedDTO` response wrappers. |
| CASL | Optional `accessibleBy` integration and policy guard helpers. |
| Decorators and pipes | Swagger helpers for query parameters and responses, query transformation, body normalization, and reusable API metadata. |
| Object utilities | Query object parsing, object diffing, Decimal serialization, and predicates. |

## Subpath Exports

```ts
import { Fields } from '@querry-kit/nest/fields';
import { QueryDTO } from '@querry-kit/nest/dto';
import { PageMetaDTO } from '@querry-kit/nest/pagination';
import { QueryService } from '@querry-kit/nest/query-service';
import { createCaslAccessibleWhere } from '@querry-kit/nest/casl';
import { ApiPaginatedResponse } from '@querry-kit/nest/swagger';
import { ApiParamId } from '@querry-kit/nest/decorators';
import { QueryTransformPipe } from '@querry-kit/nest/pipes';
import { parseObject } from '@querry-kit/nest/object';
```

## Reference Pages

- [Fields](/api/fields/)
- [DTO Schema](/api/fields/dto-schema)
- [Query Service](/api/query-service) and [complex direct QueryService examples](/api/query-service#complex-queries-without-resourcequery)
- [DTOs and Pagination](/api/dtos-pagination)
- [CASL](/api/casl)
- [Decorators, Pipes, Utilities](/api/decorators-pipes-utils)

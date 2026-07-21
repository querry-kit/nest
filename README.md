# @querry-kit/nest <!-- omit in toc -->

Consolidated NestJS helpers for Query Kit APIs: fields projection, Prisma-style query services, CASL policies, Swagger decorators, pipes, pagination DTOs, and object utilities.

📖 Documentation: https://querry-kit.github.io/nest/

## Installation

```sh
pnpm add @querry-kit/nest
```

Install CASL peers when you use the CASL integration:

```sh
pnpm add @casl/ability @casl/prisma
```

## Resource Queries

`ResourceQuery` covers the common controller flow: parse `fields`, generate Prisma includes, call a `QueryService`, map models to DTOs, and project the response.

```ts
import { ApiPaginatedResponse, QueryDTO, ResourceQuery } from '@querry-kit/nest';

@Get()
@ApiPaginatedResponse({ model: CustomerDTO })
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

Use `prepareFieldsQuery` directly when a controller needs custom service orchestration.

## Main APIs

- `Fields`, `prepareFieldsQuery`, `FieldsQuery`, and `ApiFieldsQuery` for fields projection.
- `QueryService`, `QueryDTO`, `FindByIdDTO`, and pagination DTOs for Prisma-style read endpoints.
- `createCaslAccessibleWhere`, `CheckPolicies`, and `PoliciesGuard` for CASL integration.
- `ApiPaginatedResponse`, `ApiErrorResponses`, ID/timestamp decorators, and reusable pipes.
- `parseObject`, object diff helpers, Decimal serialization, and validation helpers.

Focused subpaths are available for smaller imports:

```ts
import { Fields } from '@querry-kit/nest/fields';
import { QueryService } from '@querry-kit/nest/query-service';
import { createCaslAccessibleWhere } from '@querry-kit/nest/casl';
import { parseObject } from '@querry-kit/nest/object';
```

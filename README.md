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

`ResourceQuery` covers the common controller flow: parse optional `fields`, merge endpoint-required includes with client `include` values, generate Prisma includes for selected relations, call a `QueryService`, map models to DTOs, and project the response.

```ts
import { ApiErrorResponses, ApiPaginatedResponse, ApiResourceQuery, QueryDTO, ResourceQuery } from '@querry-kit/nest';

@Get()
@ApiResourceQuery()
@ApiPaginatedResponse({ model: CustomerDTO })
@ApiErrorResponses({ badRequestDescription: 'Invalid query parameter.' })
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

Paginated endpoints support item shorthand and envelope projection:

```txt
GET /books?fields=id,title
GET /books?fields=items{id,title},meta{page,perPage,itemCount,pageCount}
```

CASL is optional. Pass `ability` only when the endpoint should merge an authorization-aware `where` clause through `QueryService`; omit it for APIs that do not use CASL.

## Main APIs

- `Fields`, `prepareFieldsQuery`, `FieldsQuery`, `ApiFieldsQuery`, and `ApiResourceQuery` for fields projection and Swagger query documentation.
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

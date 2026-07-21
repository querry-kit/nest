---
description: 'Install and use @querry-kit/nest.'
---

# Getting Started

`@querry-kit/nest` combines the useful parts of the former Query Kit Nest packages into one import surface:

- fields parsing, validation, Prisma include generation, and response projection.
- Prisma-compatible `QueryService` helpers with pagination DTOs.
- optional CASL integration for authorization-aware read queries.
- Swagger decorators, query/body pipes, validation helpers, and object utilities.

## Installation

```sh
pnpm add @querry-kit/nest
```

Install CASL peers only when the app uses the CASL adapter:

```sh
pnpm add @casl/ability @casl/prisma
```

## Service Setup

Extend `QueryService` with a Prisma-compatible delegate and a model type map from your app.

```ts
import { Injectable } from '@nestjs/common';
import { QueryService, type BaseDelegateTypeMap } from '@querry-kit/nest';
import { Prisma, PrismaService } from '../prisma';

interface CustomerTypeMap extends BaseDelegateTypeMap {
  select: Prisma.CustomerSelect;
  include: Prisma.CustomerInclude;
  whereInput: Prisma.CustomerWhereInput;
  orderByWithRelationInput: Prisma.CustomerOrderByWithRelationInput;
  whereUniqueInput: Prisma.CustomerWhereUniqueInput;
  scalarFieldEnum: Prisma.CustomerScalarFieldEnum;
  aggregateInputType: Prisma.AggregateCustomer;
}

@Injectable()
export class CustomersService extends QueryService<typeof PrismaService.prototype.customer, CustomerTypeMap> {
  constructor(prisma: PrismaService) {
    super(prisma.customer);
  }
}
```

## Resource Controller

Use `ResourceQuery.query` when the endpoint follows the common pattern: parse optional `fields`, merge endpoint-required includes with client includes, call the service, map models to DTOs, and project the response.

```ts
import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiErrorResponses, ApiPaginatedResponse, ApiResourceQuery, QueryDTO, ResourceQuery } from '@querry-kit/nest';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

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
      include: { organization: true },
      map: (customer, ability) => CustomerDTO.fromModel(customer, ability),
    });
  }
}
```

`ApiResourceQuery()` documents `fields`, `page`, `perPage`, `select`, `include`, `where`, `orderBy`, and `distinct`. `ResourceQuery.query` keeps `fields` optional; when it is present, unknown DTO fields return HTTP 400 before the service runs. Invalid Prisma `select` or `include` values should be reported by the service layer as HTTP 400.

Paginated responses support item shorthand and envelope projection:

```http
GET /customers?fields=id,name
GET /customers?fields=items{id,name},meta{page,perPage,itemCount,pageCount}
```

The `ability` option is optional. Omit it when an endpoint does not use CASL. The `include` option is for relations required by the endpoint or ability-aware mapper; client `include` parameters extend it.

For detail endpoints, use `ResourceQuery.findById` with the same schema and mapper:

```ts
@Get(':id')
async findById(@Param('id') id: string, @Req() req: AuthRequest, @Query() query: FindByIdDTO<CustomerTypeMap>) {
  return ResourceQuery.findById({
    service: this.customersService,
    id,
    query,
    schema: CustomerDTO,
    ability: req.ability,
    map: (customer, ability) => CustomerDTO.fromModel(customer, ability),
  });
}
```

## Manual Fields Flow

Use `prepareFieldsQuery` directly when a controller needs custom service orchestration.

```ts
import { Fields, PaginatedDTO, prepareFieldsQuery } from '@querry-kit/nest';

const prepared = prepareFieldsQuery(query, CustomerDTO);
const { items, pageMeta } = await this.customersService.query<CustomerPayload>(prepared.query, req.ability);
const dtoItems = await Promise.all(items.map((item) => CustomerDTO.fromModel(item, req.ability)));

return new PaginatedDTO(Fields.project(dtoItems, prepared.projection), pageMeta);
```

## Query Parsing

Register `QueryTransformPipe` globally when query strings should be normalized before they reach controllers.

```ts
import { QueryTransformPipe } from '@querry-kit/nest';

app.useGlobalPipes(new QueryTransformPipe());
```

`QueryTransformPipe` converts values such as `'1'`, `'false'`, `'null'`, JSON strings, arrays, and dotted keys into Prisma-friendly JavaScript objects.

## Validation Pipe

`PageOptionsDTO` works with Nest validation and transformation.

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
);
```

`page` and `perPage` default to `1` and `10`, are converted to numbers, and are validated as integers.

## Example App

The repository includes an in-memory Books API that follows the same resource-controller flow with books, authors, and tags.

```sh
pnpm examples:check
pnpm examples:build
pnpm examples:start
```

Continue with the [Example App](/guide/example-app) guide for the route examples and source layout.

The guide also includes complete reference snippets for a [NestJS `main.ts`](/guide/main-bootstrap) and a [CRUD Controller](/guide/crud-controller).

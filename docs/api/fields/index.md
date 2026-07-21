---
description: 'Fields API overview for @querry-kit/nest.'
---

# Fields

The fields API is split into small classes and controller helpers. Most endpoints should use `ResourceQuery` or `prepareFieldsQuery`; use the low-level classes when you need fine-grained control.

## Resource Facade

```ts
const result = await ResourceQuery.query({
  service: this.usersService,
  query,
  schema: UserDTO,
  ability: req.ability,
  map: (user, ability) => UserDTO.fromModel(user, ability),
});
```

`schema` accepts either a manual `FieldSchema` or a Swagger-decorated DTO class. The helper:

- parses and validates `query.fields`.
- merges endpoint-required includes, client includes, and generated relation includes into a query copy.
- calls `service.query` or `service.findById`.
- maps models to DTOs, including async mappers.
- applies `Fields.project` to the mapped DTO response. Paginated responses can project either item fields (`fields=id,title` or `fields={id,title}`) or the response envelope (`fields=items{id,title},meta{page,perPage}`). An explicit empty selection (`fields=` or `fields={}`) returns an empty envelope; `items{}` can intentionally return empty item objects.

## prepareFieldsQuery

```ts
const prepared = prepareFieldsQuery(query, UserDTO, {
  baseInclude: {
    organization: true,
  },
});

await usersService.query(prepared.query, ability);
Fields.project(dtoItems, prepared.projection);
```

`prepareFieldsQuery` does not mutate the original query object. `baseInclude` is useful when the endpoint, CASL-aware mapper, or response policy needs relations even when the client omits `fields`; the client `include` query parameter extends that include object.

## Low-Level Flow

```ts
const projection = FieldsParser.parse(query.fields);

if (projection) {
  FieldsValidator.validateProjection(projection, userSchema);
}

const include = projection ? Fields.include(projection, userSchema, query.include) : query.include;
const response = FieldsProjector.project(dtoItems, projection);
```

## Manual Field Schema

```ts
import { relation, type FieldSchema } from '@querry-kit/nest/fields';

const schema: FieldSchema = {
  id: true,
  email: true,
  profile: relation({
    firstName: true,
    lastName: true,
  }),
};
```

## Decorators and Errors

Use `ApiResourceQuery()` for list endpoints that expose `fields`, `page`, `perPage`, `select`, `include`, `where`, `orderBy`, and `distinct`. Use `ApiFieldsQuery()` for detail or mutation endpoints that only expose response projection. Use `@FieldsQuery(DTO)` when a controller parameter should receive a validated `FieldsProjection`.

```ts
@Get()
@ApiFieldsQuery()
async find(@FieldsQuery(UserDTO) fields?: FieldsProjection) {}
```

Register `FieldsExceptionFilter` globally when invalid `fields` values should produce structured HTTP 400 responses.

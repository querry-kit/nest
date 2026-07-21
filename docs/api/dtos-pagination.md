---
description: 'Request DTOs, pagination DTOs, validation, transformation, and response shapes.'
---

# DTOs and Pagination

The DTOs are intended for app-level controllers. They include Swagger metadata and class-validator/class-transformer decorators where runtime validation is meaningful.

## PageOptionsDTO

`PageOptionsDTO` defaults to `page = 1` and `perPage = 10`. Both values are transformed to numbers and validated as integers.

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
);
```

The supported pagination range is:

```ts
page >= 1;
perPage >= 1;
perPage <= 1000;
```

## Query DTOs

Use the DTO matching the service method:

```ts
FindOneDTO<ProjectTypeMap>;
FindManyDTO<ProjectTypeMap>;
FindByIdDTO<ProjectTypeMap>;
FindUniqueDTO<ProjectTypeMap>;
AggregateDTO<ProjectTypeMap>;
CountDTO<ProjectTypeMap>;
QueryDTO<ProjectTypeMap>;
```

`QueryDTO` and `FindByIdDTO` expose `fields?: string`. `ResourceQuery` and `prepareFieldsQuery` use that optional value to build relation includes and project responses.

`QueryDTO` also exposes the Prisma-style query inputs used by resource list endpoints: `select`, `include`, `where`, `orderBy`, `cursor`, and `distinct`, plus `page` and `perPage` from `PageOptionsDTO`. Use `ApiResourceQuery()` to document the public query parameter contract in OpenAPI metadata.

## Service Shape

`QueryService.query` returns a service-level shape:

```ts
type Paginated<Project> = {
  items: Project[];
  pageMeta: PageMetaDTO;
};
```

Controllers usually return a public DTO shape:

```ts
return new PaginatedDTO(projectDtos, pageMeta);
```

`PageMetaDTO` computes `pageCount`, `hasPrevPage`, and `hasNextPage` from `itemCount`, `page`, and `perPage`.

`ResourceQuery.query` supports both item shorthand and envelope projection:

```txt
fields=id,name
fields=items{id,name},meta{page,perPage,itemCount,pageCount}
```

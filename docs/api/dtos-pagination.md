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
page >= 1
perPage >= 1
perPage <= 1000
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

`QueryDTO` and `FindByIdDTO` expose `fields?: string`. `ResourceQuery` and `prepareFieldsQuery` use that value to build relation includes and project responses.

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

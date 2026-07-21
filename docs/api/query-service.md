---
description: 'QueryService setup, methods, parsing, pagination, and error behavior.'
---

# Query Service

`QueryService` wraps a Prisma-compatible delegate. It does not import Prisma at runtime; generated Prisma types stay in your application and are connected through a small type map.

## Type Map

```ts
import { Injectable } from '@nestjs/common';
import { QueryService, type BaseDelegateTypeMap } from '@querry-kit/nest';
import { Prisma, PrismaService } from '../prisma';

interface ProjectTypeMap extends BaseDelegateTypeMap {
  select: Prisma.ProjectSelect;
  include: Prisma.ProjectInclude;
  whereInput: Prisma.ProjectWhereInput;
  orderByWithRelationInput: Prisma.ProjectOrderByWithRelationInput;
  whereUniqueInput: Prisma.ProjectWhereUniqueInput;
  scalarFieldEnum: Prisma.ProjectScalarFieldEnum;
  aggregateInputType: Prisma.AggregateProject;
}

@Injectable()
export class ProjectsService extends QueryService<typeof PrismaService.prototype.project, ProjectTypeMap> {
  constructor(prisma: PrismaService) {
    super(prisma.project);
  }
}
```

## Methods

```ts
await projectsService.findOne({ where: { slug: 'alpha' } });
await projectsService.findMany({ where: { archived: false }, orderBy: { name: 'asc' } });
await projectsService.findById('project_1', { include: { members: true } });
await projectsService.findUnique({ where: { slug: 'alpha' } });
await projectsService.aggregate({ where: { archived: false }, _count: true });
await projectsService.count({ where: { archived: false } });
```

`query` combines `findMany`, `count`, and `PageMetaDTO`.

```ts
const { items, pageMeta } = await projectsService.query({
  page: 2,
  perPage: 25,
  where: { archived: false },
  orderBy: { name: 'asc' },
});
```

## Complex Queries Without ResourceQuery

Use `ResourceQuery` for the common controller flow. For advanced endpoints, call `QueryService` directly and keep the Prisma-shaped query explicit in your controller or application service.

```ts
import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Fields, PaginatedDTO, QueryDTO, prepareFieldsQuery } from '@querry-kit/nest';
import type { Request } from 'express';
import { BookDTO } from './dto/book.dto';
import { BooksService, type BookModel, type BookTypeMap } from './books.service';

type RequestWithAbility = Request & {
  ability?: unknown;
};

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('search')
  async search(@Query() query: QueryDTO<BookTypeMap>, @Req() req: RequestWithAbility) {
    const result = await this.booksService.query<BookModel>(
      {
        ...query,
        where: {
          published: true,
          author: {
            name: { contains: 'Ada', mode: 'insensitive' },
          },
          tags: {
            some: { name: { in: ['nestjs', 'api'] } },
          },
        },
        include: {
          author: {
            include: {
              books: {
                select: { id: true, title: true },
              },
            },
          },
          tags: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
        page: query.page ?? 1,
        perPage: query.perPage ?? 20,
      },
      req.ability,
    );

    return new PaginatedDTO(result.items.map(BookDTO.fromModel), result.pageMeta);
  }
}
```

`QueryTransformPipe` can parse dotted query keys and JSON-like values before the DTO reaches `QueryService`.

```http
GET /books/search?where.published=true&where.author.name.contains=Ada&where.author.name.mode=insensitive&include.author.include.books.select.id=true&include.author.include.books.select.title=true&include.tags=true&orderBy=[{"publishedAt":"desc"},{"id":"asc"}]&page=1&perPage=20
```

In real clients, URL-encode JSON arrays and objects. For local `curl` testing, `curl -g` is often useful because it prevents shell globbing for brackets.

### Manual Fields Projection

`prepareFieldsQuery` is not tied to `ResourceQuery`. It can prepare includes and return the projection while you still call `QueryService` yourself.

```ts
@Get()
async findAll(@Query() query: QueryDTO<BookTypeMap>, @Req() req: RequestWithAbility) {
  const prepared = prepareFieldsQuery(query, BookDTO);
  const result = await this.booksService.query<BookModel>(prepared.query, req.ability);
  const dtoItems = result.items.map(BookDTO.fromModel);

  return new PaginatedDTO(Fields.project(dtoItems, prepared.projection), result.pageMeta);
}
```

For example, this request asks for author data through `fields`. `prepareFieldsQuery` merges the required relation include into the query before it reaches Prisma.

```http
GET /books?fields=id,title,author{id,name}&where.published=true&orderBy={"title":"asc"}
```

Existing includes are preserved. Use `baseInclude` when the endpoint, CASL-aware mapper, or response policy needs relations even when the client does not request those relation fields. Client `include` values extend that base include.

```ts
const prepared = prepareFieldsQuery(
  query,
  BookDTO,
  {
    baseInclude: {
      author: { select: { id: true, name: true } },
      tags: true,
    },
  },
);
```

When `fields` is omitted, `prepareFieldsQuery` still returns a query copy with merged endpoint and client includes. Paginated `ResourceQuery.query` endpoints additionally support projecting the response envelope:

```http
GET /books?fields=items{id,title},meta{page,perPage,itemCount,pageCount}
```

### Detail Queries

Use `findById` when the route is ID-based and should throw Nest `NotFoundException` for missing records.

```ts
@Get(':id')
async findById(
  @Param('id') id: string,
  @Query() query: QueryDTO<BookTypeMap>,
  @Req() req: RequestWithAbility,
) {
  const prepared = prepareFieldsQuery(query, BookDTO);
  const book = await this.booksService.findById<BookModel>(id, prepared.query, req.ability);
  const dto = BookDTO.fromModel(book);

  return Fields.project(dto, prepared.projection);
}
```

Use `findUnique` for natural unique keys such as `isbn` or `slug`. When an ability is passed, `QueryService` switches to `findFirst` internally so the accessibility filter can be merged into `where`.

```ts
@Get('isbn/:isbn')
async findByIsbn(@Param('isbn') isbn: string, @Req() req: RequestWithAbility) {
  const book = await this.booksService.findUnique<BookModel>(
    {
      where: { isbn },
      include: {
        author: true,
        tags: true,
      },
    },
    req.ability,
  );

  return BookDTO.fromModel(book);
}
```

### Aggregates And Counts

`aggregate` returns the delegate result with Decimal-like values serialized. `count` can receive the same ability parameter as paginated reads.

```ts
@Get('stats/summary')
async summary(@Req() req: RequestWithAbility) {
  const where = {
    published: true,
    tags: { some: { name: { in: ['nestjs', 'api'] } } },
  };

  const [aggregate, accessibleCount] = await Promise.all([
    this.booksService.aggregate({
      where,
      _count: true,
      _min: { publishedAt: true },
      _max: { publishedAt: true },
    }),
    this.booksService.count({ where }, req.ability),
  ]);

  return {
    aggregate,
    accessibleCount,
  };
}
```

## CASL Merge Behavior

When the service was created with `subject` and `accessibleWhere`, all read helpers that accept an ability merge the access filter with your query filter:

```ts
// Effective where shape:
{
  AND: [
    accessibleWhere(ability, subject),
    { published: true, authorId: 'author_1' },
  ],
}
```

This applies to `findOne`, `findMany`, `findById`, `findUnique` with ability, `query`, and `count`. `aggregate` intentionally does not accept an ability parameter in V1; pass an already constrained `where` object when you expose aggregate endpoints.

## Query Parsing

Inputs are normalized with `parseQueryObject`, a public wrapper around the bundled object utilities.

```ts
parseQueryObject({
  'owner.email': 'ada@example.com',
  archived: 'false',
  tags: '["crm","internal"]',
});

// {
//   owner: { email: 'ada@example.com' },
//   archived: false,
//   tags: ['crm', 'internal']
// }
```

Invalid JSON-like strings are preserved instead of throwing during parsing. Prisma validation errors are converted later by `QueryService`.

## Error Mapping

- Prisma validation-like errors become `BadRequestException`.
- Known Prisma request errors with a `code` become `BadRequestException`.
- Existing Nest `HttpException` instances pass through.
- Unexpected errors are logged through `errorLogger` when configured and then masked as `InternalServerErrorException`.

---
description: 'Complete CRUD controller example for @querry-kit/nest.'
---

# CRUD Controller

This controller shows a full resource shape with list, detail, create, update, and delete routes. Read endpoints use `ResourceQuery` so `fields`, Prisma-style includes, service calls, DTO mapping, and projection stay in one small pattern.

```ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiPaginatedResponse,
  ApiParamId,
  CheckPolicies,
  FindByIdDTO,
  PoliciesGuard,
  QueryDTO,
  ResourceQuery,
} from '@querry-kit/nest';
import { BookDTO, type BookModel, CreateBookDTO, UpdateBookDTO } from './book.dto.js';
import { BooksService, type BookTypeMap, type DemoAbility } from './books.service.js';

type DemoRequest = {
  ability: DemoAbility;
};

@ApiTags('books')
@Controller('books')
@UseGuards(PoliciesGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @CheckPolicies<DemoAbility>((ability) => ability.can('read', 'Book'))
  @ApiOperation({ summary: 'Query published books' })
  @ApiPaginatedResponse({ description: 'Paginated list of published books', model: BookDTO })
  @ApiErrorResponses({ forbiddenCodes: ['InsufficientPermissions'] })
  async query(@Req() req: DemoRequest, @Query() query: QueryDTO<BookTypeMap>) {
    return ResourceQuery.query({
      service: this.booksService,
      query,
      schema: BookDTO,
      ability: req.ability,
      map: (book: BookModel) => BookDTO.fromModel(book),
    });
  }

  @Get(':id')
  @CheckPolicies<DemoAbility>((ability) => ability.can('read', 'Book'))
  @ApiParamId({ description: 'Book ID', name: 'id' })
  @ApiOperation({ summary: 'Find a published book by ID' })
  @ApiErrorResponses({ forbiddenCodes: ['InsufficientPermissions'], notFoundCodes: ['BookNotFound'] })
  async findById(@Param('id') id: string, @Req() req: DemoRequest, @Query() query: FindByIdDTO<BookTypeMap>) {
    return ResourceQuery.findById({
      service: this.booksService,
      id,
      query,
      schema: BookDTO,
      ability: req.ability,
      map: (book: BookModel) => BookDTO.fromModel(book),
    });
  }

  @Post()
  @CheckPolicies<DemoAbility>((ability) => ability.can('create', 'Book'))
  @ApiOperation({ summary: 'Create a book' })
  @ApiCreatedResponse({ description: 'The created book', type: BookDTO })
  @ApiErrorResponses({ forbiddenCodes: ['InsufficientPermissions'] })
  async create(@Body() data: CreateBookDTO) {
    return BookDTO.fromModel(await this.booksService.create(data));
  }

  @Patch(':id')
  @CheckPolicies<DemoAbility>((ability) => ability.can('update', 'Book'))
  @ApiParamId({ description: 'Book ID', name: 'id' })
  @ApiOperation({ summary: 'Update a book' })
  @ApiOkResponse({ description: 'The updated book', type: BookDTO })
  @ApiErrorResponses({ forbiddenCodes: ['InsufficientPermissions'], notFoundCodes: ['BookNotFound'] })
  async update(@Param('id') id: string, @Body() data: UpdateBookDTO) {
    return BookDTO.fromModel(await this.booksService.update(id, data));
  }

  @Delete(':id')
  @CheckPolicies<DemoAbility>((ability) => ability.can('delete', 'Book'))
  @ApiParamId({ description: 'Book ID', name: 'id' })
  @ApiOperation({ summary: 'Delete a book' })
  @ApiErrorResponses({ forbiddenCodes: ['InsufficientPermissions'], notFoundCodes: ['BookNotFound'] })
  async remove(@Param('id') id: string) {
    return BookDTO.fromModel(await this.booksService.remove(id));
  }
}
```

## Service Contract

`ResourceQuery` expects read services with the same shape as `QueryService`:

```ts
service.query<TModel>(query, ability);
service.findById<TModel>(id, query, ability);
```

Create, update, and delete stay resource-specific because they usually contain domain rules, transactions, unique checks, and relation writes.

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponses,
  ApiFieldsQuery,
  ApiPaginatedResponse,
  ApiParamId,
  ApiResourceQuery,
  CheckPolicies,
  Fields,
  FindByIdDTO,
  PoliciesGuard,
  QueryDTO,
  ResourceQuery,
  prepareFieldsQuery,
} from '@querry-kit/nest';
import { BookDTO, CreateBookDTO, UpdateBookDTO, type BookModel } from './book.dto.js';
import { BookAction, BookSubject, BooksService, type BookTypeMap, type DemoAbility } from './books.service.js';

type DemoRequest = {
  ability: DemoAbility;
};

@ApiTags('books')
@Controller('books')
@UseGuards(PoliciesGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @CheckPolicies<DemoAbility>((ability) => ability.can(BookAction.Read, BookSubject))
  @ApiOperation({ summary: 'Query published books' })
  @ApiResourceQuery()
  @ApiPaginatedResponse({ description: 'Paginated list of published books', model: BookDTO })
  @ApiErrorResponses({ badRequestDescription: 'Invalid query parameter.', forbiddenCodes: ['InsufficientPermissions'] })
  async query(@Req() req: DemoRequest, @Query() query: QueryDTO<BookTypeMap>) {
    return ResourceQuery.query({
      service: this.booksService,
      query,
      schema: BookDTO,
      ability: req.ability,
      include: { author: true },
      map: (book: BookModel) => BookDTO.fromModel(book),
    });
  }

  @Get(':id')
  @CheckPolicies<DemoAbility>((ability) => ability.can(BookAction.Read, BookSubject))
  @ApiParamId({ description: 'Book ID', name: 'id' })
  @ApiOperation({ summary: 'Find a published book by ID' })
  @ApiFieldsQuery()
  @ApiOkResponse({ description: 'The published book', type: BookDTO })
  @ApiErrorResponses({
    badRequestDescription: 'Invalid fields or include query parameter.',
    forbiddenCodes: ['InsufficientPermissions'],
    notFoundCodes: ['BookNotFound'],
  })
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
  @CheckPolicies<DemoAbility>((ability) => ability.can(BookAction.Create, BookSubject))
  @ApiOperation({ summary: 'Create a book' })
  @ApiFieldsQuery()
  @ApiCreatedResponse({ description: 'The created book', type: BookDTO })
  @ApiErrorResponses({
    badRequestDescription: 'Invalid request body or fields query parameter.',
    forbiddenCodes: ['InsufficientPermissions'],
  })
  async create(@Body() data: CreateBookDTO, @Query() query: FindByIdDTO<BookTypeMap>) {
    const prepared = prepareFieldsQuery(query, BookDTO);
    const dto = BookDTO.fromModel(await this.booksService.create(data, prepared.query));

    return Fields.project(dto, prepared.projection);
  }

  @Patch(':id')
  @CheckPolicies<DemoAbility>((ability) => ability.can(BookAction.Update, BookSubject))
  @ApiParamId({ description: 'Book ID', name: 'id' })
  @ApiOperation({ summary: 'Update a book' })
  @ApiFieldsQuery()
  @ApiOkResponse({ description: 'The updated book', type: BookDTO })
  @ApiErrorResponses({
    badRequestDescription: 'Invalid request body or fields query parameter.',
    forbiddenCodes: ['InsufficientPermissions'],
    notFoundCodes: ['BookNotFound'],
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBookDTO,
    @Req() req: DemoRequest,
    @Query() query: FindByIdDTO<BookTypeMap>,
  ) {
    const prepared = prepareFieldsQuery(query, BookDTO);
    const dto = BookDTO.fromModel(await this.booksService.update(id, data, prepared.query, req.ability));

    return Fields.project(dto, prepared.projection);
  }

  @Delete(':id')
  @CheckPolicies<DemoAbility>((ability) => ability.can(BookAction.Delete, BookSubject))
  @ApiParamId({ description: 'Book ID', name: 'id' })
  @ApiOperation({ summary: 'Delete a book' })
  @ApiFieldsQuery()
  @ApiOkResponse({ description: 'The deleted book', type: BookDTO })
  @ApiErrorResponses({
    badRequestDescription: 'Invalid fields or include query parameter.',
    forbiddenCodes: ['InsufficientPermissions'],
    notFoundCodes: ['BookNotFound'],
  })
  async remove(@Param('id') id: string, @Query() query: FindByIdDTO<BookTypeMap>) {
    const prepared = prepareFieldsQuery(query, BookDTO);
    const dto = BookDTO.fromModel(await this.booksService.remove(id, prepared.query));

    return Fields.project(dto, prepared.projection);
  }
}

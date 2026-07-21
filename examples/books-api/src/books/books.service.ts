import { AbilityBuilder, PureAbility, subject } from '@casl/ability';
import { createPrismaAbility } from '@casl/prisma';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  createCaslAccessibleWhere,
  QueryService,
  type BaseDelegateTypeMap,
  type QueryOptionsMap,
} from '@querry-kit/nest';
import { BookDelegate, type BookInclude, type BookWhereInput } from './book.delegate.js';
import type { BookModel, CreateBookDTO, UpdateBookDTO } from './book.dto.js';

export enum BookAction {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export const BookSubject = 'Book';

export type DemoAbility = PureAbility<[BookAction, any], any>;

/**
 * Creates the ability used by the in-memory example API.
 *
 * @returns {DemoAbility} Ability that reads published books and updates drafts only.
 */
export function createDemoAbility(): DemoAbility {
  const { can, build } = new AbilityBuilder<DemoAbility>(createPrismaAbility);

  can(BookAction.Read, BookSubject, { published: true });
  can(BookAction.Create, BookSubject);
  can(BookAction.Update, BookSubject, { published: false });
  can(BookAction.Delete, BookSubject);

  return build();
}

export interface BookTypeMap extends BaseDelegateTypeMap {
  select: Partial<Record<keyof BookModel, boolean>>;
  include: BookInclude;
  whereInput: BookWhereInput;
  orderByWithRelationInput: Partial<Record<keyof BookModel, 'asc' | 'desc'>>;
  whereUniqueInput: Pick<BookModel, 'id'>;
  scalarFieldEnum: keyof BookModel;
  aggregateInputType: { _count?: true };
}

@Injectable()
export class BooksService extends QueryService<
  BookDelegate,
  BookTypeMap,
  BookDelegate,
  QueryOptionsMap<BookTypeMap>,
  DemoAbility,
  typeof BookSubject
> {
  private readonly delegate: BookDelegate;

  constructor() {
    const delegate = new BookDelegate();
    super(delegate, {
      subject: BookSubject,
      accessibleWhere: createCaslAccessibleWhere<DemoAbility, typeof BookSubject, BookAction>({
        action: BookAction.Read,
      }),
    });
    this.delegate = delegate;
  }

  async create(data: CreateBookDTO, query: QueryOptionsMap<BookTypeMap>['findById'] = {}): Promise<BookModel> {
    return this.delegate.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        authorId: data.authorId,
        tagIds: data.tagIds,
      },
      include: query.include,
    });
  }

  async update(
    id: string,
    data: UpdateBookDTO,
    query: QueryOptionsMap<BookTypeMap>['findById'] = {},
    ability?: DemoAbility,
  ): Promise<BookModel> {
    const existing = await this.delegate.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Book not found.');
    }

    if (!ability?.can(BookAction.Update, subject(BookSubject, existing))) {
      throw new ForbiddenException('Insufficient permissions.');
    }

    const updated = await this.delegate.update({
      where: { id },
      data,
      include: query.include,
    });
    if (!updated) {
      throw new NotFoundException('Book not found.');
    }
    return updated;
  }

  async remove(id: string, query: QueryOptionsMap<BookTypeMap>['findById'] = {}): Promise<BookModel> {
    const deleted = await this.delegate.delete({ where: { id }, include: query.include });
    if (!deleted) {
      throw new NotFoundException('Book not found.');
    }
    return deleted;
  }
}

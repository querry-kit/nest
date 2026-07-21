import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryService, type BaseDelegateTypeMap, type QueryOptionsMap } from '@querry-kit/nest';
import { BookDelegate, type BookInclude, type BookWhereInput } from './book.delegate.js';
import type { BookModel, CreateBookDTO, UpdateBookDTO } from './book.dto.js';

export type DemoAbility = {
  can(action: string, subject: string): boolean;
};

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
  'Book'
> {
  private readonly delegate: BookDelegate;

  constructor() {
    const delegate = new BookDelegate();
    super(delegate, {
      subject: 'Book',
      accessibleWhere: () => ({ published: true }),
    });
    this.delegate = delegate;
  }

  async create(data: CreateBookDTO): Promise<BookModel> {
    return this.delegate.create({
      data: {
        title: data.title,
        isbn: data.isbn,
        authorId: data.authorId,
        tagIds: data.tagIds,
      },
    });
  }

  async update(id: string, data: UpdateBookDTO): Promise<BookModel> {
    const updated = await this.delegate.update({
      where: { id },
      data,
      include: { author: true, tags: true },
    });
    if (!updated) {
      throw new NotFoundException('Book not found.');
    }
    return updated;
  }

  async remove(id: string): Promise<BookModel> {
    const deleted = await this.delegate.delete({ where: { id } });
    if (!deleted) {
      throw new NotFoundException('Book not found.');
    }
    return deleted;
  }
}

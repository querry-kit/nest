import { BadRequestException } from '@nestjs/common';
import type { BookModel } from './book.dto.js';

type FindArgs = {
  where?: BookWhereInput;
  select?: BookSelect;
  include?: BookInclude;
  take?: number;
  skip?: number;
  orderBy?: Partial<Record<keyof BookModel, 'asc' | 'desc'>>;
};

export type BookSelect = Partial<Record<keyof BookModel, boolean>>;

export type BookInclude = {
  author?: boolean | { include?: { books?: boolean } };
  tags?: boolean;
};

export type BookWhereInput = Partial<Pick<BookModel, 'id' | 'title' | 'isbn' | 'published' | 'authorId'>> & {
  AND?: BookWhereInput[];
  OR?: BookWhereInput[];
};

const bookRows: BookModel[] = [
  {
    id: 'book-1',
    title: 'Practical Nest Queries',
    isbn: '978-0000000001',
    published: true,
    authorId: 'author-ada',
    tagIds: ['tag-nest', 'tag-api'],
  },
  {
    id: 'book-2',
    title: 'Typed Prisma Services',
    isbn: '978-0000000002',
    published: true,
    authorId: 'author-grace',
    tagIds: ['tag-prisma', 'tag-api'],
  },
  {
    id: 'book-3',
    title: 'Draft Authorization Rules',
    isbn: '978-0000000003',
    published: false,
    authorId: 'author-ada',
    tagIds: ['tag-casl'],
  },
];

const authorRows = [
  { id: 'author-ada', name: 'Ada Lovelace' },
  { id: 'author-grace', name: 'Grace Hopper' },
];

const tagRows = [
  { id: 'tag-api', name: 'api' },
  { id: 'tag-casl', name: 'casl' },
  { id: 'tag-nest', name: 'nestjs' },
  { id: 'tag-prisma', name: 'prisma' },
];

export class BookDelegate {
  async create(args: { data: Omit<BookModel, 'id' | 'published'>; include?: BookInclude }): Promise<BookModel> {
    this.validateInclude(args.include);
    const item: BookModel = {
      id: `book-${bookRows.length + 1}`,
      published: true,
      ...args.data,
    };
    bookRows.push(item);
    return this.include(item, args.include);
  }

  async findMany(args: FindArgs = {}): Promise<BookModel[]> {
    this.validateSelect(args.select);
    this.validateInclude(args.include);
    const filtered = this.sort(this.filter(args.where), args.orderBy);
    return filtered
      .slice(args.skip ?? 0, (args.skip ?? 0) + (args.take ?? filtered.length))
      .map((book) => this.include(book, args.include));
  }

  async updateMany(args: unknown): Promise<unknown> {
    return args;
  }

  async update(args: {
    where?: { id?: string };
    data?: Partial<BookModel>;
    include?: BookInclude;
  }): Promise<BookModel | null> {
    this.validateInclude(args.include);
    const book = bookRows.find((row) => row.id === args.where?.id);
    if (!book) {
      return null;
    }
    Object.assign(book, args.data);
    return this.include(book, args.include);
  }

  async upsert(args: unknown): Promise<unknown> {
    return args;
  }

  async deleteMany(args: unknown): Promise<unknown> {
    return args;
  }

  async delete(args: { where?: { id?: string }; include?: BookInclude }): Promise<BookModel | null> {
    this.validateInclude(args.include);
    const index = bookRows.findIndex((book) => book.id === args.where?.id);
    if (index === -1) {
      return null;
    }
    return this.include(bookRows.splice(index, 1)[0], args.include);
  }

  async findFirst(args: FindArgs = {}): Promise<BookModel | null> {
    this.validateSelect(args.select);
    this.validateInclude(args.include);
    return this.filter(args.where).map((book) => this.include(book, args.include))[0] ?? null;
  }

  async findUnique(
    args: { where?: { id?: string }; select?: BookSelect; include?: BookInclude } = {},
  ): Promise<BookModel | null> {
    this.validateSelect(args.select);
    this.validateInclude(args.include);
    const book = bookRows.find((row) => row.id === args.where?.id);
    return book ? this.include(book, args.include) : null;
  }

  async aggregate(): Promise<{ _count: number }> {
    return { _count: bookRows.length };
  }

  async count(args: { where?: BookWhereInput } = {}): Promise<number> {
    return this.filter(args.where).length;
  }

  private filter(where: BookWhereInput = {}): BookModel[] {
    return bookRows.filter((book) => this.matches(book, where));
  }

  private matches(book: BookModel, where: BookWhereInput): boolean {
    const { AND, OR, ...fields } = where;

    return (
      (AND?.every((condition) => this.matches(book, condition)) ?? true) &&
      (OR?.some((condition) => this.matches(book, condition)) ?? true) &&
      Object.entries(fields).every(([key, value]) => book[key as keyof BookModel] === value)
    );
  }

  private sort(books: BookModel[], orderBy?: FindArgs['orderBy']): BookModel[] {
    if (!orderBy) {
      return books;
    }
    const [key, direction] = Object.entries(orderBy)[0] as [keyof BookModel, 'asc' | 'desc'];
    return [...books].sort((a, b) => {
      const left = String(a[key]);
      const right = String(b[key]);
      return direction === 'desc' ? right.localeCompare(left) : left.localeCompare(right);
    });
  }

  private include(book: BookModel, include?: BookInclude): BookModel {
    return {
      ...book,
      ...(include?.author ? { author: this.buildAuthor(book.authorId, include.author) } : {}),
      ...(include?.tags ? { tags: tagRows.filter((tag) => book.tagIds.includes(tag.id)) } : {}),
    };
  }

  private validateSelect(select?: BookSelect): void {
    if (!select) {
      return;
    }

    for (const key of Object.keys(select)) {
      if (!['id', 'title', 'isbn', 'published', 'authorId', 'tagIds', 'author', 'tags'].includes(key)) {
        throw new BadRequestException(`Invalid select field "${key}".`);
      }
    }
  }

  private validateInclude(include?: BookInclude): void {
    if (!include) {
      return;
    }

    for (const key of Object.keys(include)) {
      if (!['author', 'tags'].includes(key)) {
        throw new BadRequestException(`Invalid include field "${key}".`);
      }
    }

    const author = include.author;
    if (author && typeof author === 'object') {
      const authorInclude = author.include;
      for (const key of Object.keys(authorInclude ?? {})) {
        if (key !== 'books') {
          throw new BadRequestException(`Invalid include field "author.${key}".`);
        }
      }
    }
  }

  private buildAuthor(authorId: string, include: NonNullable<BookInclude['author']>) {
    const author = authorRows.find((row) => row.id === authorId);
    if (!author) {
      return undefined;
    }
    const includeBooks = typeof include === 'object' && include.include?.books;
    return {
      ...author,
      ...(includeBooks ? { books: bookRows.filter((book) => book.authorId === author.id && book.published) } : {}),
    };
  }
}

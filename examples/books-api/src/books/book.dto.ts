import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export type TagModel = {
  id: string;
  name: string;
};

export type AuthorModel = {
  id: string;
  name: string;
  books?: BookModel[];
};

export type BookModel = {
  id: string;
  title: string;
  isbn: string;
  published: boolean;
  authorId: string;
  tagIds: string[];
  author?: AuthorModel;
  tags?: TagModel[];
};

export class TagDTO {
  @Expose()
  @ApiProperty({ example: 'tag-api' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'api' })
  name!: string;

  static fromModel(model: TagModel): TagDTO {
    return Object.assign(new TagDTO(), model);
  }
}

export class BookSummaryDTO {
  @Expose()
  @ApiProperty({ example: 'book-1' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Practical Nest Queries' })
  title!: string;

  static fromModel(model: BookModel): BookSummaryDTO {
    return Object.assign(new BookSummaryDTO(), {
      id: model.id,
      title: model.title,
    });
  }
}

export class AuthorDTO {
  @Expose()
  @ApiProperty({ example: 'author-ada' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Ada Lovelace' })
  name!: string;

  @Expose()
  @ApiProperty({ type: () => [BookSummaryDTO], required: false })
  books?: BookSummaryDTO[];

  static fromModel(model: AuthorModel): AuthorDTO {
    return Object.assign(new AuthorDTO(), {
      id: model.id,
      name: model.name,
      books: model.books?.map(BookSummaryDTO.fromModel),
    });
  }
}

export class BookDTO {
  @Expose()
  @ApiProperty({ example: 'book-1' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Practical Nest Queries' })
  title!: string;

  @Expose()
  @ApiProperty({ example: '978-0000000001' })
  isbn!: string;

  @Expose()
  @ApiProperty({ example: true })
  published!: boolean;

  @Expose()
  @ApiProperty({ type: () => AuthorDTO, required: false })
  author?: AuthorDTO;

  @Expose()
  @ApiProperty({ type: () => [TagDTO], required: false })
  tags?: TagDTO[];

  static fromModel(model: BookModel): BookDTO {
    return Object.assign(new BookDTO(), {
      id: model.id,
      title: model.title,
      isbn: model.isbn,
      published: model.published,
      author: model.author ? AuthorDTO.fromModel(model.author) : undefined,
      tags: model.tags?.map(TagDTO.fromModel),
    });
  }
}

export class CreateBookDTO {
  @ApiProperty({ example: 'Composable Nest APIs' })
  title!: string;

  @ApiProperty({ example: '978-0000000004' })
  isbn!: string;

  @ApiProperty({ example: 'author-ada' })
  authorId!: string;

  @ApiProperty({ example: ['tag-nest', 'tag-api'] })
  tagIds!: string[];
}

export class UpdateBookDTO {
  @ApiProperty({ example: 'Composable Nest APIs', required: false })
  title?: string;

  @ApiProperty({ example: '978-0000000004', required: false })
  isbn?: string;

  @ApiProperty({ example: 'author-ada', required: false })
  authorId?: string;

  @ApiProperty({ example: ['tag-nest', 'tag-api'], required: false })
  tagIds?: string[];

  @ApiProperty({ example: true, required: false })
  published?: boolean;
}

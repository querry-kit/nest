import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBadRequestResponse, ApiQuery } from '@nestjs/swagger';

/**
 * Options for {@link ApiResourceQuery}.
 */
export type ApiResourceQueryOptions = {
  /** Include `page` and `perPage` query parameters. */
  pagination?: boolean;
};

const queryObjectSchema = {
  oneOf: [{ type: 'object' }, { type: 'string' }],
};

const invalidResourceQueryDescription =
  'Invalid fields syntax, unknown fields, invalid include/select, or invalid query values.';

const invalidResourceQueryResponse = {
  description: invalidResourceQueryDescription,
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'number', default: HttpStatus.BAD_REQUEST },
      error: { type: 'string', default: 'Bad Request' },
      message: { type: 'string' },
    },
  },
  examples: {
    invalidResourceQuery: {
      summary: 'Invalid resource query',
      value: {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: invalidResourceQueryDescription,
      },
    },
  },
};

/**
 * Documents the common Query Kit resource query parameters.
 *
 * @param {ApiResourceQueryOptions} [options] Optional query metadata options.
 * @returns {MethodDecorator & ClassDecorator} A composed Swagger decorator.
 */
export function ApiResourceQuery(options: ApiResourceQueryOptions = {}): MethodDecorator & ClassDecorator {
  const decorators: Array<MethodDecorator & ClassDecorator> = [
    ApiQuery({
      name: 'fields',
      required: false,
      type: String,
      description:
        'Response field projection. Use `id,title` for item fields or `items{id,title},meta{page,perPage}` for paginated envelopes.',
      example: 'items{id,title,author{name}},meta{page,perPage,itemCount,pageCount}',
    }),
    ApiQuery({
      name: 'select',
      required: false,
      schema: queryObjectSchema,
      description: 'Prisma select object. Invalid select values are reported as HTTP 400 by the service layer.',
    }),
    ApiQuery({
      name: 'include',
      required: false,
      schema: queryObjectSchema,
      description:
        'Prisma include object. Client includes are merged with endpoint-required includes and fields-generated relation includes.',
    }),
    ApiQuery({
      name: 'where',
      required: false,
      schema: queryObjectSchema,
      description: 'Prisma where object. Dotted query keys are expanded and primitive values are parsed.',
    }),
    ApiQuery({
      name: 'orderBy',
      required: false,
      schema: { oneOf: [{ type: 'object' }, { type: 'array' }, { type: 'string' }] },
      description: 'Prisma orderBy object or array.',
    }),
    ApiQuery({
      name: 'distinct',
      required: false,
      schema: { oneOf: [{ type: 'string' }, { type: 'array' }] },
      description: 'Prisma distinct field or fields.',
    }),
    ApiBadRequestResponse(invalidResourceQueryResponse),
  ];

  if (options.pagination ?? true) {
    decorators.unshift(
      ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Current page number.',
        example: 1,
      }),
      ApiQuery({
        name: 'perPage',
        required: false,
        type: Number,
        description: 'Number of items per page.',
        example: 10,
      }),
    );
  }

  return applyDecorators(...decorators);
}

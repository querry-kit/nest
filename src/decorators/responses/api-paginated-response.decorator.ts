import { applyDecorators, type Type } from '@nestjs/common';
import type { ApiResponseExamples, OpenAPIObject } from '@nestjs/swagger';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

type LinksObject = NonNullable<NonNullable<OpenAPIObject['components']>['links']>;

export type ApiPaginatedResponseOptions<T> = {
  /** DTO class used for each item in the paginated `items` array. */
  model: Type<T>;
  /** Optional response description. Defaults to `Paginated items`. */
  description?: string;
  /** Optional OpenAPI links included in the response metadata. */
  links?: LinksObject;
  /** Optional single response example. */
  example?: unknown;
  /** Optional named response examples. */
  examples?: {
    [key: string]: ApiResponseExamples;
  };
};

/**
 * Adds a paginated item response schema to the Swagger operation.
 *
 * @param {ApiPaginatedResponseOptions<TModel>} options The response model and optional response metadata.
 * @returns {MethodDecorator & ClassDecorator} The composed Swagger response decorator.
 */
export function ApiPaginatedResponse<TModel>(
  options: ApiPaginatedResponseOptions<TModel>,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      description: options.description ?? 'Paginated items',

      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: getSchemaPath(options.model) },
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'number', description: 'Current page number' },
              perPage: {
                type: 'number',
                description: 'Number of items per page',
              },
              itemCount: {
                type: 'number',
                description: 'Total number of items',
              },
              pageCount: {
                type: 'number',
                description: 'Total number of pages',
              },
              hasPrevPage: {
                type: 'boolean',
                description: 'Indicates if there is a previous page',
              },
              hasNextPage: {
                type: 'boolean',
                description: 'Indicates if there is a next page',
              },
            },
          },
        },
      },
    }),
  );
}

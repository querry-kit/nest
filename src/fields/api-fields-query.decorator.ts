import { applyDecorators } from '@nestjs/common';
import type { ApiQueryOptions, ApiResponseNoStatusOptions } from '@nestjs/swagger';
import { ApiBadRequestResponse, ApiQuery } from '@nestjs/swagger';

/**
 * Options for `ApiFieldsQuery`.
 */
export type ApiFieldsQueryOptions = {
  query?: Omit<ApiQueryOptions, 'name' | 'required' | 'type'>;
  badRequest?: ApiResponseNoStatusOptions;
};

const defaultQueryDescription =
  'Comma-separated response field projection. Use nested selections with braces, for example `id,name,profile{email}`.';

const defaultBadRequestDescription = 'The `fields` query parameter is invalid.';

/**
 * Documents the `fields` query parameter and its validation error response.
 *
 * @param {ApiFieldsQueryOptions} [options] Optional Swagger metadata overrides.
 * @returns {MethodDecorator & ClassDecorator} A composed Swagger decorator.
 */
export function ApiFieldsQuery(options: ApiFieldsQueryOptions = {}): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiQuery({
      name: 'fields',
      required: false,
      type: String,
      description: defaultQueryDescription,
      ...options.query,
    }),
    ApiBadRequestResponse({
      description: defaultBadRequestDescription,
      schema: {
        type: 'object',
        required: ['statusCode', 'message', 'details'],
        properties: {
          statusCode: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Invalid fields query parameter',
          },
          details: {
            type: 'string',
            example: 'unknown field "name"',
          },
          path: {
            type: 'string',
            example: 'profile.name',
          },
          position: {
            type: 'number',
            example: 8,
          },
        },
      },
      ...options.badRequest,
    }),
  );
}

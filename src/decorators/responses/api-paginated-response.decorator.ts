import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath, type ApiResponseOptions } from '@nestjs/swagger';
import { PageMetaDTO } from '../../pagination/page-meta.dto.js';
import { PaginatedDTO } from '../../pagination/paginated.dto.js';

/**
 * Options for {@link ApiPaginatedResponse}.
 */
export type ApiPaginatedResponseOptions<T> = Omit<ApiResponseOptions, 'schema' | 'type'> & {
  /** DTO class used as the item schema inside the paginated `items` array. */
  model: Type<T>;
};

/**
 * Adds a paginated response schema to a Swagger operation.
 *
 * @param options Response options.
 * @returns Composed Swagger decorator.
 */
export function ApiPaginatedResponse<TModel>(
  options: ApiPaginatedResponseOptions<TModel>,
): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiExtraModels(PaginatedDTO, PageMetaDTO, options.model),
    ApiOkResponse({
      ...options,
      description: options.description ?? 'Paginated items',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDTO) },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(options.model) },
              },
              meta: { $ref: getSchemaPath(PageMetaDTO) },
            },
          },
        ],
      },
    }),
  );
}

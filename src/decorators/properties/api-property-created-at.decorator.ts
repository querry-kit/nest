import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Adds a created-at date property to the Swagger schema.
 *
 * @param {ApiPropertyOptions} options Optional Swagger property overrides.
 * @returns {PropertyDecorator} The composed Swagger property decorator.
 */
export function ApiPropertyCreatedAt(options: ApiPropertyOptions = {}): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      description: options.description ?? 'The creation date of the item.',
      ...options,
    }),
  );
}

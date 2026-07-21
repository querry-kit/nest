import { applyDecorators } from '@nestjs/common';
import { ApiProperty, type ApiPropertyOptions } from '@nestjs/swagger';

/**
 * Adds a UUID ID property to the Swagger schema.
 *
 * @param {ApiPropertyOptions} options Optional Swagger property overrides.
 * @returns {PropertyDecorator} The composed Swagger property decorator.
 */
export function ApiPropertyId(options: ApiPropertyOptions = {}): PropertyDecorator {
  return applyDecorators(
    ApiProperty({
      example: options.example ?? crypto.randomUUID(),
      description: options.description ?? 'The ID of the item.',
      ...options,
    }),
  );
}

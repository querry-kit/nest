import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export type ApiParamIdOptions = {
  /** Name of the route parameter. Defaults to `id`. */
  name?: string;
  /** Optional description shown in the Swagger parameter schema. */
  description?: string;
};

/**
 * Adds a UUID route parameter to the Swagger schema.
 *
 * @param {ApiParamIdOptions} options Optional name and description overrides.
 * @returns {MethodDecorator} The composed Swagger parameter decorator.
 */
export function ApiParamId(options: ApiParamIdOptions = {}): MethodDecorator {
  return applyDecorators(
    ApiParam({
      name: options.name ?? 'id',
      description: options.description,
      type: 'string',
      format: 'uuid',
    }),
  );
}

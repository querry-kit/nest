import { applyDecorators } from '@nestjs/common';
import type { ApiErrorResponsesOptions } from './error-responses/api-error-responses.types.js';
import { getResponseDecoratorOptions } from './error-responses/get-response-decorator-options.js';
import { getStatusConfigs } from './error-responses/get-status-configs.js';

export type { ApiErrorResponsesOptions, Code } from './error-responses/api-error-responses.types.js';

/**
 * Decorator to define multiple error responses for a controller or method.
 *
 * @param {ApiErrorResponsesOptions} options Options to configure error responses.
 * @returns {MethodDecorator & ClassDecorator} The composed response decorator.
 */
export function ApiErrorResponses(options: ApiErrorResponsesOptions = {}): MethodDecorator & ClassDecorator {
  const decorators = getStatusConfigs(options)
    .filter((config) => config.codes || config.description)
    .map((config) => config.decorator(getResponseDecoratorOptions(config.status, config.codes, config.description)));

  return applyDecorators(...decorators);
}

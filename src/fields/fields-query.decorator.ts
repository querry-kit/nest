import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { buildFieldSchemaFromDto } from './core/dto-schema';
import { Fields } from './core/fields';
import { DtoClass } from './types/dto-schema.types';
import { FieldsParseOptions } from './types/fields.types';
import { FieldsProjection } from './types/schema.types';

type FieldsQueryDecoratorData = {
  dtoClass: DtoClass;
  options?: FieldsParseOptions;
};

type RequestWithQuery = {
  query?: {
    fields?: unknown;
  };
};

const FieldsQueryParam = createParamDecorator<FieldsQueryDecoratorData, FieldsProjection | undefined>(
  (data: FieldsQueryDecoratorData, context: ExecutionContext): FieldsProjection | undefined => {
    const request = context.switchToHttp().getRequest<RequestWithQuery>();
    const schema = buildFieldSchemaFromDto(data.dtoClass);

    return Fields.parseAndValidate(request.query?.fields, schema, data.options);
  },
);

/**
 * Parses and validates the `fields` query parameter against a Swagger DTO.
 *
 * @param {DtoClass} dtoClass The Swagger-decorated DTO class used to build the field schema.
 * @param {FieldsParseOptions} [options] The validation options forwarded to `Fields.parseAndValidate`.
 * @returns {ParameterDecorator} A NestJS parameter decorator that resolves a fields projection.
 */
export function FieldsQuery(dtoClass: DtoClass, options?: FieldsParseOptions): ParameterDecorator {
  return FieldsQueryParam({ dtoClass, options });
}

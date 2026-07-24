import { createRelationSchemaNode, FieldsBadRequestException, FieldSchema, FieldsValidator } from '../index';

describe('FieldsValidator', () => {
  const schema: FieldSchema = {
    id: true,
    email: true,
    profile: createRelationSchemaNode({
      id: true,
      firstName: true,
      avatar: createRelationSchemaNode({ id: true }),
    }),
  };

  it('validates known fields and nested relation fields', () => {
    expect(() => FieldsValidator.validateProjection({ id: true, profile: { firstName: true } }, schema)).not.toThrow();
  });

  it('rejects unknown fields and invalid nested scalar selections', () => {
    expect(() => FieldsValidator.validateProjection({ unknown: true }, schema)).toThrow(FieldsBadRequestException);
    expect(() => FieldsValidator.validateProjection({ email: { value: true } }, schema)).toThrow(
      FieldsBadRequestException,
    );
  });

  it('can disallow nested selections', () => {
    expect(() => FieldsValidator.validateNoNestedSelection({ id: true })).not.toThrow();
    expect(() => FieldsValidator.validateNoNestedSelection({ profile: { id: true } })).toThrow(
      FieldsBadRequestException,
    );
  });

  it('validates include requirements for selected relations', () => {
    expect(() =>
      FieldsValidator.validateIncludeRequirements({ profile: true }, schema, { profile: true }),
    ).not.toThrow();

    expect(() =>
      FieldsValidator.validateIncludeRequirements({ profile: { firstName: true } }, schema, { profile: true }),
    ).not.toThrow();

    expect(() =>
      FieldsValidator.validateIncludeRequirements({ profile: { avatar: { id: true } } }, schema, {
        profile: { include: { avatar: true } },
      }),
    ).not.toThrow();
  });

  it('rejects missing or ambiguous include requirements', () => {
    expect(() => FieldsValidator.validateIncludeRequirements({ profile: true }, schema, undefined)).toThrow(
      FieldsBadRequestException,
    );

    expect(() =>
      FieldsValidator.validateIncludeRequirements({ profile: { avatar: { id: true } } }, schema, { profile: true }),
    ).toThrow(FieldsBadRequestException);
  });
});

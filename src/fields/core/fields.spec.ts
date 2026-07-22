import { Fields, FieldsBadRequestException, FieldSchema, relation } from '../index';

describe('Fields facade', () => {
  const schema: FieldSchema = {
    id: true,
    profile: relation({
      id: true,
      avatar: relation({ id: true }),
    }),
  };

  it('parses and validates fields', () => {
    expect(Fields.parseAndValidate('profile{id}', schema)).toEqual({
      profile: { id: true },
    });
    expect(Fields.parseAndValidate(undefined, schema)).toBeUndefined();
    expect(() => Fields.parseAndValidate('profile{id}', schema, { allowNested: false })).toThrow(
      FieldsBadRequestException,
    );
  });

  it('preserves explicit empty projections and validates required relation includes', () => {
    expect(Fields.parseAndValidate('', schema)).toEqual({});
    expect(
      Fields.parseAndValidate('profile{avatar{id}}', schema, {
        requireIncludeForRelations: true,
        include: { profile: { include: { avatar: true } } },
      }),
    ).toEqual({ profile: { avatar: { id: true } } });
  });

  it('projects through the facade', () => {
    expect(Fields.project({ id: '1', email: 'a@example.test' }, { id: true })).toEqual({
      id: '1',
    });
  });
});

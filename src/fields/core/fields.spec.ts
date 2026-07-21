import { createRelationSchemaNode, Fields, FieldsBadRequestException, FieldSchema } from '../index';

describe('Fields facade', () => {
  const schema: FieldSchema = {
    id: true,
    profile: createRelationSchemaNode({
      id: true,
      avatar: createRelationSchemaNode({ id: true }),
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

  it('projects through the facade', () => {
    expect(Fields.project({ id: '1', email: 'a@example.test' }, { id: true })).toEqual({
      id: '1',
    });
  });
});

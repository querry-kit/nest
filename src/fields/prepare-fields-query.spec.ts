import { FieldsBadRequestException, createRelationSchemaNode, type FieldSchema } from './index';
import { prepareFieldsQuery } from './prepare-fields-query';

describe('prepareFieldsQuery', () => {
  const schema: FieldSchema = {
    id: true,
    name: true,
    profile: createRelationSchemaNode({
      id: true,
      avatar: createRelationSchemaNode({ id: true }),
    }),
  };

  it('builds includes from fields projections and preserves existing includes', () => {
    const query = {
      fields: 'id,profile{avatar{id}}',
      include: { profile: { include: { settings: true } } },
      where: { active: 'true' },
    };

    const prepared = prepareFieldsQuery(query, schema);

    expect(prepared.projection).toEqual({
      id: true,
      profile: { avatar: { id: true } },
    });
    expect(prepared.query).toEqual({
      fields: 'id,profile{avatar{id}}',
      include: {
        profile: {
          include: {
            settings: true,
            avatar: true,
          },
        },
      },
      where: { active: 'true' },
    });
  });

  it('does not mutate the incoming query object', () => {
    const query = {
      fields: 'profile{id}',
      include: { profile: { where: { active: true } } },
    };

    const prepared = prepareFieldsQuery(query, schema);

    expect(prepared.query).not.toBe(query);
    expect(prepared.query.include).not.toBe(query.include);
    expect(query).toEqual({
      fields: 'profile{id}',
      include: { profile: { where: { active: true } } },
    });
  });

  it('throws fields bad request exceptions for invalid fields', () => {
    expect(() => prepareFieldsQuery({ fields: 'unknown' }, schema)).toThrow(FieldsBadRequestException);
  });
});

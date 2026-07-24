import { ApiProperty } from '@nestjs/swagger';
import { FieldsBadRequestException, createRelationSchemaNode, type FieldSchema } from './index';
import { prepareFieldsQuery, resolveFieldSchema } from './prepare-fields-query';

class PreparedProfileDto {
  @ApiProperty()
  id!: string;
}

class PreparedUserDto {
  @ApiProperty({ type: () => PreparedProfileDto })
  profile!: PreparedProfileDto;
}

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

  it('merges endpoint includes and client includes when fields are omitted', () => {
    const prepared = prepareFieldsQuery(
      {
        include: { profile: { include: { avatar: true } } },
      },
      schema,
      {
        baseInclude: { profile: { include: { settings: true } } },
      },
    );

    expect(prepared.projection).toBeUndefined();
    expect(prepared.query).toEqual({
      include: {
        profile: {
          include: {
            settings: true,
            avatar: true,
          },
        },
      },
    });
  });

  it('keeps an explicit empty projection while preserving required includes', () => {
    const prepared = prepareFieldsQuery({ fields: '' }, schema, { baseInclude: { profile: true } });

    expect(prepared.projection).toEqual({});
    expect(prepared.query).toEqual({
      fields: '',
      include: { profile: true },
    });
  });

  it('merges endpoint includes, client includes and fields-generated includes', () => {
    const prepared = prepareFieldsQuery(
      {
        fields: 'profile{avatar{id}}',
        include: { profile: { include: { settings: true } } },
      },
      schema,
      {
        baseInclude: { auditTrail: true },
      },
    );

    expect(prepared.query).toEqual({
      fields: 'profile{avatar{id}}',
      include: {
        auditTrail: true,
        profile: {
          include: {
            settings: true,
            avatar: true,
          },
        },
      },
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

  it('accepts Swagger DTO classes as a field schema source', () => {
    expect(resolveFieldSchema(PreparedUserDto)).toEqual({
      profile: createRelationSchemaNode({ id: true }),
    });
  });
});

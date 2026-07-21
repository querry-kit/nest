import { createRelationSchemaNode, type FieldSchema } from './fields/index';
import { PageMetaDTO } from './pagination/page-meta.dto';
import { ResourceQuery } from './resource-query';

describe('ResourceQuery', () => {
  const schema: FieldSchema = {
    id: true,
    name: true,
    profile: createRelationSchemaNode({ id: true, email: true }),
  };
  const ability = { can: true };

  it('prepares fields, calls the service with ability, maps DTOs and projects paginated results', async () => {
    const service = {
      query: jest.fn().mockResolvedValue({
        items: [{ id: '1', name: 'Ada', profile: { id: 'p1', email: 'ada@example.test' } }],
        pageMeta: new PageMetaDTO({ itemCount: 1, pageOptions: { page: 1, perPage: 10 } }),
      }),
      findById: jest.fn(),
    };

    const result = await ResourceQuery.query({
      service,
      query: { fields: '{id,profile{id}}', include: { profile: { where: { active: 'true' } } } },
      schema,
      ability,
      map: async (item: { id: string; name: string; profile: { id: string; email: string } }, passedAbility) => ({
        id: item.id,
        name: item.name,
        profile: item.profile,
        canRead: passedAbility === ability,
      }),
    });

    expect(service.query).toHaveBeenCalledWith(
      {
        fields: '{id,profile{id}}',
        include: { profile: { where: { active: true } } },
      },
      ability,
    );
    expect(result.items).toEqual([{ id: '1', profile: { id: 'p1' } }]);
    expect(result.meta.itemCount).toBe(1);
  });

  it('projects paginated response envelopes including page metadata', async () => {
    const service = {
      query: jest.fn().mockResolvedValue({
        items: [{ id: '1', name: 'Ada', profile: { id: 'p1', email: 'ada@example.test' } }],
        pageMeta: new PageMetaDTO({ itemCount: 12, pageOptions: { page: 2, perPage: 10 } }),
      }),
      findById: jest.fn(),
    };

    const result = await ResourceQuery.query({
      service,
      query: { fields: 'items{id,profile{id}},meta{page,perPage,itemCount,pageCount}' },
      schema,
      include: { profile: { where: { active: 'true' } } },
      map: (item: { id: string; name: string; profile: { id: string; email: string } }) => ({
        id: item.id,
        name: item.name,
        profile: item.profile,
      }),
    });

    expect(service.query).toHaveBeenCalledWith(
      {
        fields: 'items{id,profile{id}},meta{page,perPage,itemCount,pageCount}',
        include: { profile: { where: { active: true } } },
      },
      undefined,
    );
    expect(result).toEqual({
      items: [{ id: '1', profile: { id: 'p1' } }],
      meta: { page: 2, perPage: 10, itemCount: 12, pageCount: 2 },
    });
  });

  it('projects empty paginated envelopes and empty item selections', async () => {
    const service = {
      query: jest.fn().mockResolvedValue({
        items: [{ id: '1', name: 'Ada' }],
        pageMeta: new PageMetaDTO({ itemCount: 1, pageOptions: { page: 3, perPage: 10 } }),
      }),
      findById: jest.fn(),
    };
    const map = (item: { id: string; name: string }) => item;

    for (const fields of ['', '{}']) {
      await expect(ResourceQuery.query({ service, query: { fields }, schema, map })).resolves.toEqual({});
    }
    await expect(
      ResourceQuery.query({ service, query: { fields: 'items{},meta{page}' }, schema, map }),
    ).resolves.toEqual({ items: [{}], meta: { page: 3 } });
  });

  it('merges endpoint includes with client includes when fields are omitted', async () => {
    const service = {
      query: jest.fn().mockResolvedValue({
        items: [{ id: '1', name: 'Ada', profile: { id: 'p1', email: 'ada@example.test' } }],
        pageMeta: new PageMetaDTO({ itemCount: 1, pageOptions: { page: 1, perPage: 10 } }),
      }),
      findById: jest.fn(),
    };

    await ResourceQuery.query({
      service,
      query: { include: { profile: { include: { avatar: true } } } },
      schema,
      include: { profile: { where: { active: 'true' } } },
      map: (item: { id: string; name: string; profile: { id: string; email: string } }) => ({
        id: item.id,
        name: item.name,
        profile: item.profile,
      }),
    });

    expect(service.query).toHaveBeenCalledWith(
      {
        include: {
          profile: {
            where: { active: true },
            include: { avatar: true },
          },
        },
      },
      undefined,
    );
  });

  it('prepares fields, calls findById with ability and projects detail responses', async () => {
    const service = {
      query: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1', name: 'Ada', profile: { id: 'p1', email: 'ada@example.test' } }),
    };

    const result = await ResourceQuery.findById({
      service,
      id: '1',
      query: { fields: 'profile{email}' },
      schema,
      ability,
      map: (item: { id: string; name: string; profile: { id: string; email: string } }) => ({
        id: item.id,
        name: item.name,
        profile: item.profile,
      }),
    });

    expect(service.findById).toHaveBeenCalledWith(
      '1',
      {
        fields: 'profile{email}',
        include: { profile: true },
      },
      ability,
    );
    expect(result).toEqual({ profile: { email: 'ada@example.test' } });
  });

  it('projects an explicit empty fields value for detail responses', async () => {
    const service = {
      query: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: '1', name: 'Ada' }),
    };

    await expect(
      ResourceQuery.findById({
        service,
        id: '1',
        query: { fields: '' },
        schema,
        map: (item: { id: string; name: string }) => item,
      }),
    ).resolves.toEqual({});
  });
});

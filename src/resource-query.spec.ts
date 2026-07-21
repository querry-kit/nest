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
      query: { fields: 'id,profile{id}', include: { profile: { where: { active: 'true' } } } },
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
        fields: 'id,profile{id}',
        include: { profile: { where: { active: true } } },
      },
      ability,
    );
    expect(result.items).toEqual([{ id: '1', profile: { id: 'p1' } }]);
    expect(result.meta.itemCount).toBe(1);
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
});

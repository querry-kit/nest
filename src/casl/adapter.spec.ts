const mockAccessibleBy = jest.fn();

jest.mock('@casl/prisma', () => ({
  accessibleBy: mockAccessibleBy,
}));

import { createCaslAccessibleWhere } from './adapter.js';

describe('CASL adapter', () => {
  it('maps CASL Prisma v1 subject maps into a generic where resolver', () => {
    const ability = { can: true } as never;
    mockAccessibleBy.mockReturnValue({ Book: { organizationId: 'org' } });

    const resolver = createCaslAccessibleWhere({ action: 'read' });

    expect(resolver(ability, 'Book')).toEqual({ organizationId: 'org' });
    expect(mockAccessibleBy).toHaveBeenCalledWith(ability, 'read');
  });

  it('maps CASL Prisma v2 accessible records through ofType', () => {
    const ability = { can: true } as never;
    const ofType = jest.fn().mockReturnValue({ organizationId: 'org' });
    mockAccessibleBy.mockReturnValue({ ofType });

    const resolver = createCaslAccessibleWhere({ action: 'READ' });

    expect(resolver(ability, 'Book')).toEqual({ organizationId: 'org' });
    expect(mockAccessibleBy).toHaveBeenCalledWith(ability, 'READ');
    expect(ofType).toHaveBeenCalledWith('Book');
  });

  it('maps CASL Prisma v1 proxy records without probing ofType as a subject', () => {
    const ability = { can: true } as never;
    const records = new Proxy(
      { Book: { organizationId: 'org' } },
      {
        get(target, property) {
          if (property === 'ofType') {
            throw new Error('ofType is interpreted as a subject by CASL Prisma v1.');
          }

          return target[property as keyof typeof target];
        },
      },
    );
    mockAccessibleBy.mockReturnValue(records);

    const resolver = createCaslAccessibleWhere({ action: 'read' });

    expect(resolver(ability, 'Book')).toEqual({ organizationId: 'org' });
  });

  it('uses read as the default action', () => {
    const ability = { can: true } as never;
    mockAccessibleBy.mockReturnValue({ Book: { id: '1' } });

    createCaslAccessibleWhere()(ability, 'Book');

    expect(mockAccessibleBy).toHaveBeenCalledWith(ability, 'read');
  });
});

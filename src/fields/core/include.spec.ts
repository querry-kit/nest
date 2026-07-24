import { Fields, FieldSchema, relation } from '../index';

describe('Fields.include', () => {
  const schema: FieldSchema = {
    id: true,
    profile: relation({
      id: true,
      avatar: relation({
        id: true,
        file: relation({ id: true }),
      }),
      settings: relation({ id: true }),
    }),
  };

  it('builds includes from selected relation fields', () => {
    expect(Fields.include({ profile: { id: true } }, schema)).toEqual({ profile: true });
    expect(Fields.include({ profile: { avatar: { id: true } } }, schema)).toEqual({
      profile: {
        include: { avatar: true },
      },
    });
  });

  it('normalizes dotted include keys before merging generated includes', () => {
    expect(
      Fields.include({ profile: { avatar: { id: true } } }, schema, {
        'profile.where.active': 'true',
      }),
    ).toEqual({
      profile: {
        where: { active: true },
        include: { avatar: true },
      },
    });
  });

  it('merges generated includes into existing include objects', () => {
    expect(
      Fields.include({ profile: { avatar: { file: { id: true } } } }, schema, {
        profile: { include: { settings: true } },
      }),
    ).toEqual({
      profile: {
        include: {
          settings: true,
          avatar: { include: { file: true } },
        },
      },
    });
  });

  it('merges generated relation keys into existing select objects', () => {
    expect(
      Fields.include({ profile: { avatar: { id: true }, settings: { id: true } } }, schema, {
        profile: { select: { id: true } },
      }),
    ).toEqual({
      profile: {
        select: {
          id: true,
          avatar: true,
          settings: true,
        },
      },
    });
  });

  it('ignores non-object existing include values', () => {
    expect(Fields.include({ profile: { avatar: { id: true } } }, schema, 'profile')).toEqual({
      profile: {
        include: { avatar: true },
      },
    });
    expect(Fields.include({ profile: { avatar: { id: true } } }, schema, ['profile'])).toEqual({
      profile: {
        include: { avatar: true },
      },
    });
    expect(Fields.include({ profile: { avatar: { id: true } } }, schema, null)).toEqual({
      profile: {
        include: { avatar: true },
      },
    });
  });
});

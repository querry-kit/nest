import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { filterCaslFields, type CaslFieldAbility } from './dto-filter.js';

type Ability = CaslFieldAbility<'read' | 'READ'>;

describe('filterCaslFields', () => {
  const dto = { id: 'user-1', email: 'ada@example.test', internalNote: 'restricted' };

  it('returns a shallow copy when no ability is provided', () => {
    const result = filterCaslFields(dto, 'User');

    expect(result).toEqual(dto);
    expect(result).not.toBe(dto);
  });

  it('keeps every field when the all field is allowed', () => {
    const ability: Ability = {
      can: jest.fn().mockReturnValue(true),
    };

    const result = filterCaslFields(dto, 'User', ability);

    expect(result).toEqual(dto);
    expect(result).not.toBe(dto);
    expect(ability.can).toHaveBeenCalledTimes(1);
    expect(ability.can).toHaveBeenCalledWith('read', expect.objectContaining(dto), 'all');
  });

  it('keeps only individually readable fields without mutating the input DTO', () => {
    const ability: Ability = {
      can: jest.fn((_, __, field) => field === 'id' || field === 'email'),
    };

    const result = filterCaslFields(dto, 'User', ability);

    expect(result).toEqual({ id: 'user-1', email: 'ada@example.test' });
    expect(dto).toEqual({ id: 'user-1', email: 'ada@example.test', internalNote: 'restricted' });
    expect(ability.can).toHaveBeenCalledWith('read', expect.objectContaining(dto), 'id');
    expect(ability.can).toHaveBeenCalledWith('read', expect.objectContaining(dto), 'email');
    expect(ability.can).toHaveBeenCalledWith('read', expect.objectContaining(dto), 'internalNote');
  });

  it('supports applications that use an uppercase read action', () => {
    const ability: Ability = {
      can: jest.fn((action, _, field) => action === 'READ' && field === 'id'),
    };

    expect(filterCaslFields(dto, 'User', ability, { action: 'READ' })).toEqual({ id: 'user-1' });
  });

  it('evaluates conditional rules against the CASL subject', () => {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    can('read', 'User', ['email'], { id: 'user-1' });

    expect(filterCaslFields(dto, 'User', build())).toEqual({ email: 'ada@example.test' });
  });

  it('preserves the DTO prototype', () => {
    class UserDTO {
      id = 'user-1';
      email = 'ada@example.test';
    }

    const result = filterCaslFields(new UserDTO(), 'User', {
      can: (_, __, field) => field === 'id',
    });

    expect(result).toBeInstanceOf(UserDTO);
    expect(result).toEqual({ id: 'user-1' });
  });
});

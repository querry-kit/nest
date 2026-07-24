import { createObjectFromPath } from './create-from-path';

describe('createObjectFromPath', () => {
  it('creates a flat object for a flat path', () => {
    expect(createObjectFromPath('name', 'Ada')).toEqual({ name: 'Ada' });
  });

  it('creates a nested object for a dotted path', () => {
    expect(createObjectFromPath('user.profile.name', 'Ada')).toEqual({
      user: { profile: { name: 'Ada' } },
    });
  });
});

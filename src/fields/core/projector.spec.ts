import { FieldsProjector } from '../index';

describe('FieldsProjector', () => {
  it('projects objects and arrays', () => {
    const value = [
      { id: '1', email: 'a@example.test', profile: { id: 'p1', firstName: 'Ada' } },
      { id: '2', email: 'b@example.test', profile: { id: 'p2', firstName: 'Linus' } },
    ];

    expect(FieldsProjector.project(value, { id: true, profile: { firstName: true } })).toEqual([
      { id: '1', profile: { firstName: 'Ada' } },
      { id: '2', profile: { firstName: 'Linus' } },
    ]);
  });

  it('returns unchanged values without a projection', () => {
    expect(FieldsProjector.project({ id: '1' })).toEqual({ id: '1' });
    expect(FieldsProjector.project(null, { id: true })).toBeNull();
    expect(FieldsProjector.project('value', { id: true })).toBe('value');
  });
});

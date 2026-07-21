import { createRelationSchemaNode, type FieldSchema } from '../index';
import {
  fieldsValidationBadRequest,
  getIncludeChild,
  getNestedIncludeContext,
  hasNestedRelationSelection,
} from './validator.helpers';

describe('fields validator helpers', () => {
  const schema: FieldSchema = {
    id: true,
    profile: createRelationSchemaNode({ id: true }),
  };

  it('normalizes include values and relation checks', () => {
    expect(getIncludeChild('invalid', 'profile')).toBeUndefined();
    expect(getIncludeChild({ profile: true }, 'profile')).toBe(true);
    expect(getNestedIncludeContext(true)).toBe(true);
    expect(getNestedIncludeContext({ include: { profile: true } })).toEqual({ profile: true });
    expect(getNestedIncludeContext({ include: 'invalid' })).toEqual({ include: 'invalid' });
    expect(hasNestedRelationSelection({ id: true }, schema)).toBe(false);
    expect(hasNestedRelationSelection({ profile: { id: true } }, schema)).toBe(true);
  });

  it('creates standardized validation exceptions', () => {
    expect(fieldsValidationBadRequest('Unknown field', 'profile.name').getResponse()).toEqual({
      message: 'Invalid fields query parameter',
      details: 'Unknown field',
      path: 'profile.name',
    });
  });
});

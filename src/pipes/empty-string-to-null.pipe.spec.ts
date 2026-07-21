import { ArgumentMetadata } from '@nestjs/common';
import { EmptyStringToNullPipe } from './empty-string-to-null.pipe';

describe('EmptyStringToNullPipe', () => {
  let pipe: EmptyStringToNullPipe;

  const bodyMeta: ArgumentMetadata = {
    type: 'body',
    metatype: undefined,
    data: undefined,
  };
  const queryMeta: ArgumentMetadata = {
    type: 'query',
    metatype: undefined,
    data: undefined,
  };

  beforeEach(() => {
    pipe = new EmptyStringToNullPipe();
  });

  it('replaces empty string values in body with null', () => {
    const value = { displayName: '', workspaceName: 'tenant' };
    const result = pipe.transform(value, bodyMeta) as Record<string, unknown>;

    expect(result.displayName).toBeNull();
    expect(result.workspaceName).toBe('tenant');
  });

  it('replaces whitespace-only string values in body with null', () => {
    const value = { displayName: '   ', workspaceName: 'tenant' };
    const result = pipe.transform(value, bodyMeta) as Record<string, unknown>;

    expect(result.displayName).toBeNull();
    expect(result.workspaceName).toBe('tenant');
  });

  it('trims non-empty string values in body', () => {
    const value = { displayName: '  Jane Doe  ', workspaceName: 'tenant' };
    const result = pipe.transform(value, bodyMeta) as Record<string, unknown>;

    expect(result.displayName).toBe('Jane Doe');
    expect(result.workspaceName).toBe('tenant');
  });

  it('replaces nested empty strings in body recursively', () => {
    const value = {
      address: {
        street: '',
        city: 'Berlin',
      },
    };
    const result = pipe.transform(value, bodyMeta) as Record<string, any>;

    expect(result.address.street).toBeNull();
    expect(result.address.city).toBe('Berlin');
  });

  it('replaces empty strings inside body arrays', () => {
    const value = {
      tags: ['', 'alpha', ''],
      nested: [{ value: '' }],
    };
    const result = pipe.transform(value, bodyMeta) as Record<string, any>;

    expect(result.tags).toEqual([null, 'alpha', null]);
    expect(result.nested[0].value).toBeNull();
  });

  it('does not run for non-body metadata', () => {
    const value = { search: '  query  ' };
    const result = pipe.transform(value, queryMeta);

    expect(result).toEqual({ search: '  query  ' });
  });
});

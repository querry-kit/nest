import { FieldsBadRequestException, FieldsParser } from '../index';

describe('FieldsParser', () => {
  it('parses top-level and nested fields', () => {
    expect(FieldsParser.parse('id,email,profile{id,firstName}')).toEqual({
      id: true,
      email: true,
      profile: { id: true, firstName: true },
    });
  });

  it('merges duplicate nested field selections', () => {
    expect(FieldsParser.parse('profile{id},profile{firstName}')).toEqual({
      profile: { id: true, firstName: true },
    });
  });

  it('keeps a scalar selection when a duplicate nested selection follows', () => {
    expect(FieldsParser.parse('id,id{nested}')).toEqual({ id: true });
  });

  it('returns undefined for omitted values and an empty projection for an explicit empty string', () => {
    expect(FieldsParser.parse(undefined)).toBeUndefined();
    expect(FieldsParser.parse(null)).toBeUndefined();
    expect(FieldsParser.parse('')).toEqual({});
  });

  it('accepts optional outer braces and empty selection sets', () => {
    expect(FieldsParser.parse('{id,email}')).toEqual({ id: true, email: true });
    expect(FieldsParser.parse('{id} ')).toEqual({ id: true });
    expect(FieldsParser.parse('{}')).toEqual({});
    expect(FieldsParser.parse('profile{}')).toEqual({ profile: {} });
  });

  it('allows whitespace around tokens', () => {
    expect(FieldsParser.parse(' id , profile { firstName } ')).toEqual({
      id: true,
      profile: { firstName: true },
    });
  });

  it('rejects invalid field values', () => {
    expect(() => FieldsParser.parse({})).toThrow(FieldsBadRequestException);
    expect(() => FieldsParser.parse('   ')).toThrow(FieldsBadRequestException);
    expect(() => FieldsParser.parse('1invalid')).toThrow(FieldsBadRequestException);
    expect(() => FieldsParser.parse('id email')).toThrow(FieldsBadRequestException);
    expect(() => FieldsParser.parse('{id}!')).toThrow(FieldsBadRequestException);
    expect(() => FieldsParser.parse('profile{id')).toThrow(FieldsBadRequestException);
  });
});

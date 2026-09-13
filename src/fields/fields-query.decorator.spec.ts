const mockCreateParamDecorator = jest.fn();
let mockFactory: ((data: unknown, context: unknown) => unknown) | undefined;

const actualNestCommon = await import('@nestjs/common');

jest.unstable_mockModule('@nestjs/common', () => ({
  ...actualNestCommon,
  createParamDecorator: mockCreateParamDecorator.mockImplementation((factory: typeof mockFactory) => {
    mockFactory = factory;
    return jest.fn();
  }),
}));

import { ApiProperty } from '@nestjs/swagger';

const { FieldsQuery } = await import('./fields-query.decorator.js');

class UserDto {
  @ApiProperty()
  id!: string;
}

describe('FieldsQuery', () => {
  it('parses the request fields value through the generated parameter factory', () => {
    FieldsQuery(UserDto);

    expect(mockFactory).toBeDefined();
    expect(
      mockFactory!(
        { dtoClass: UserDto },
        {
          switchToHttp: () => ({ getRequest: () => ({ query: { fields: 'id' } }) }),
        },
      ),
    ).toEqual({ id: true });
  });
});

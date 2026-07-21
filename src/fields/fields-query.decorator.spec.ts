const mockCreateParamDecorator = jest.fn();
let mockFactory: ((data: unknown, context: unknown) => unknown) | undefined;

jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  createParamDecorator: mockCreateParamDecorator.mockImplementation((factory: typeof mockFactory) => {
    mockFactory = factory;
    return jest.fn();
  }),
}));

import { ApiProperty } from '@nestjs/swagger';

import { FieldsQuery } from './fields-query.decorator';

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

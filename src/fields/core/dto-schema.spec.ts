import { ApiProperty } from '@nestjs/swagger';

import { buildFieldSchemaFromDto, getDtoFields, relation } from '../index';

class ProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;
}

class UserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ type: () => ProfileDto })
  profile!: ProfileDto;
}

class TreeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => TreeDto })
  parent!: TreeDto;
}

class NoMetadataDto {
  id!: string;
}

describe('DTO field schema', () => {
  it('creates manual relation schema nodes through the relation alias', () => {
    expect(relation({ id: true })).toEqual({ relation: true, fields: { id: true } });
  });

  it('reads Swagger DTO fields', () => {
    expect(getDtoFields(UserDto)).toEqual(['id', 'email', 'profile']);
  });

  it('builds nested relation schemas from DTO metadata', () => {
    expect(buildFieldSchemaFromDto(UserDto)).toEqual({
      id: true,
      email: true,
      profile: relation({ id: true, firstName: true }),
    });
  });

  it('returns empty schemas without metadata and cuts off recursion', () => {
    expect(getDtoFields(NoMetadataDto)).toEqual([]);
    expect(buildFieldSchemaFromDto(NoMetadataDto)).toEqual({});
    expect(buildFieldSchemaFromDto(TreeDto)).toEqual({
      id: true,
      parent: relation({
        id: true,
        parent: relation({}),
      }),
    });
  });
});

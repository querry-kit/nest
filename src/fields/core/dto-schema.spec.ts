import { ApiProperty } from '@nestjs/swagger';

import { buildFieldSchemaFromDto, createRelationSchemaNode, getDtoFields, relation } from '../index';

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

class MetadataEdgeCasesDto {
  throwing!: unknown;
  nested!: ProfileDto;
  fallback!: number;
}

describe('DTO field schema', () => {
  it('creates manual relation schema nodes through the relation alias', () => {
    expect(relation({ id: true })).toEqual(createRelationSchemaNode({ id: true }));
  });

  it('reads Swagger DTO fields', () => {
    expect(getDtoFields(UserDto)).toEqual(['id', 'email', 'profile']);
  });

  it('builds nested relation schemas from DTO metadata', () => {
    expect(buildFieldSchemaFromDto(UserDto)).toEqual({
      id: true,
      email: true,
      profile: createRelationSchemaNode({ id: true, firstName: true }),
    });
  });

  it('returns empty schemas without metadata and cuts off recursion', () => {
    expect(getDtoFields(NoMetadataDto)).toEqual([]);
    expect(buildFieldSchemaFromDto(NoMetadataDto)).toEqual({});
    expect(buildFieldSchemaFromDto(TreeDto)).toEqual({
      id: true,
      parent: createRelationSchemaNode({
        id: true,
        parent: createRelationSchemaNode({}),
      }),
    });
  });

  it('handles malformed and alternative Swagger property metadata', () => {
    Reflect.defineMetadata('swagger/apiModelPropertiesArray', 'invalid', NoMetadataDto.prototype);
    expect(getDtoFields(NoMetadataDto)).toEqual([]);

    Reflect.defineMetadata(
      'swagger/apiModelPropertiesArray',
      [':throwing', ':nested', ':fallback'],
      MetadataEdgeCasesDto.prototype,
    );
    Reflect.defineMetadata(
      'swagger/apiModelProperties',
      {
        type: () => {
          throw new Error('unresolvable Swagger type');
        },
      },
      MetadataEdgeCasesDto.prototype,
      'throwing',
    );
    Reflect.defineMetadata(
      'swagger/apiModelProperties',
      { type: [ProfileDto] },
      MetadataEdgeCasesDto.prototype,
      'nested',
    );
    Reflect.defineMetadata('design:type', Number, MetadataEdgeCasesDto.prototype, 'fallback');

    expect(buildFieldSchemaFromDto(MetadataEdgeCasesDto)).toEqual({
      throwing: true,
      nested: createRelationSchemaNode({ id: true, firstName: true }),
      fallback: true,
    });
  });
});

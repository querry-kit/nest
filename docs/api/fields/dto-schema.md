---
description: 'DTO schema helpers for @querry-kit/nest.'
---

# DTO Schema

`buildFieldSchemaFromDto(dtoClass)` reads Swagger metadata from DTO classes and returns a `FieldSchema`.

```ts
class UserDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty({ type: () => ProfileDTO })
  profile!: ProfileDTO;
}

const schema = buildFieldSchemaFromDto(UserDTO);
```

Swagger-decorated nested DTO classes become relation fields. Recursive DTO references are cut off with an empty nested schema to avoid infinite traversal.

## Metadata Requirements

- Only properties decorated with `@ApiProperty` or compatible Swagger metadata are included.
- DTO classes without Swagger property metadata produce an empty schema.
- Nested DTO classes become relation schema nodes when their type metadata points to another Swagger-decorated DTO.
- Arrays of DTOs are supported when Swagger exposes the array item type, for example with `@ApiProperty({ type: () => [BookDTO] })`.
- Recursive references are cut off with an empty nested relation schema.

Use a manual schema with `relation` when the public response shape differs from Swagger metadata.

## getDtoFields

```ts
const fields = getDtoFields(UserDTO);
```

`getDtoFields` returns the Swagger-decorated property names for a DTO class. DTOs without Swagger property metadata return an empty array.

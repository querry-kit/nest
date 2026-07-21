---
description: 'Reusable NestJS parameter and DTO property decorators.'
---

# Decorators

Use the decorators subpath for reusable route parameter and DTO property metadata.

```ts
import { ApiParamId, ApiPropertyCreatedAt, ApiPropertyId, ApiPropertyUpdatedAt } from '@querry-kit/nest/decorators';
```

`ApiParamId` documents ID route parameters.

```ts
@Get(':id')
@ApiParamId({ description: 'User ID', name: 'id' })
findById(@Param('id') id: string) {}
```

Property decorators cover common DTO fields:

```ts
class UserDTO {
  @ApiPropertyId()
  id!: string;

  @ApiPropertyCreatedAt()
  createdAt!: Date;

  @ApiPropertyUpdatedAt()
  updatedAt!: Date;
}
```

OpenAPI response decorators are documented separately in [OpenAPI Decorators](/api/openapi).

---
description: 'Fields projection syntax and behavior for @querry-kit/nest.'
---

# Fields Projection

The `fields` query parameter lets clients request a smaller public response shape.

```txt
id,email,profile{firstName,lastName}
```

The server still validates every requested field against an explicit schema or Swagger DTO metadata before it loads relations or projects the response.

## Syntax

| Rule | Example |
| ---- | ------- |
| Field names start with `A-Z`, `a-z`, or `_`. | `id`, `_meta` |
| Remaining characters may also contain digits. | `line1`, `profile2` |
| Commas separate sibling selections. | `id,email` |
| Braces select nested relation fields. | `profile{firstName}` |
| Whitespace around tokens is ignored. | `id, profile { firstName }` |

Empty nested selections such as `profile{}` and unsupported field-name characters are rejected before validation.

## Validation

Scalar fields use `true`. Relation fields use `relation({ ... })`.

```ts
import { relation, type FieldSchema } from '@querry-kit/nest/fields';

const schema: FieldSchema = {
  id: true,
  email: true,
  profile: relation({
    firstName: true,
    lastName: true,
  }),
};
```

Unknown fields and nested selections on scalar fields throw `FieldsBadRequestException`.

## Include Generation

Selected relation fields can be converted into Prisma-compatible includes.

```ts
Fields.include({ profile: { firstName: true } }, schema);
// { profile: true }
```

Existing include configuration is preserved, and dotted keys are normalized through the bundled object parser.

```ts
Fields.include({ profile: { firstName: true } }, schema, {
  'profile.where.active': 'true',
});
// { profile: { where: { active: true } } }
```

## Projection

Projection happens after DTO mapping, so the public DTO shape remains the source of truth.

```ts
Fields.project(userDto, { id: true, profile: { firstName: true } });
```

Arrays are projected item by item. Primitive values, `null`, and `undefined` are returned unchanged.

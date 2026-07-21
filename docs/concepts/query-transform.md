---
description: 'How query parameter transformation works in @querry-kit/nest.'
---

# Query Transformation

HTTP query parameters usually arrive in NestJS as strings. `QueryTransformPipe` turns query objects into predictable JavaScript values before controller code receives them.

## Pipeline

`QueryTransformPipe` only transforms Nest arguments where `metadata.type === 'query'`.

```ts
if (metadata.type === 'query' && typeof value === 'object') {
  return parseObject(value);
}
```

Route params, body values, and custom metadata types are returned unchanged.

## Parsing Rules

| Input                    | Output                      |
| ------------------------ | --------------------------- |
| `'42'`                   | `42`                        |
| `'3.14'`                 | `3.14`                      |
| `'true'`                 | `true`                      |
| `'false'`                | `false`                     |
| `'null'`                 | `null`                      |
| `['1', '2']`             | `[1, 2]`                    |
| `{ 'user.name': 'Ada' }` | `{ user: { name: 'Ada' } }` |

Valid JSON object and array strings are parsed recursively. Invalid JSON-like strings and empty strings are preserved.

## Dotted Keys

```ts
parseObject({
  'where.profile.name': 'Ada',
  'where.active': 'true',
});

// {
//   where: {
//     profile: { name: 'Ada' },
//     active: true
//   }
// }
```

Avoid sending both dotted and nested variants for the same path; normal object assignment semantics decide the final value.

## Validation

The pipe normalizes values; it does not validate them. Compose it with Nest's `ValidationPipe` and DTO classes for request validation.

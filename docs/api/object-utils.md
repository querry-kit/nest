---
description: 'Object parsing, diff helpers, Decimal serialization, and validation utilities.'
---

# Object Utilities

The object subpath contains query parsing and general object helpers.

```ts
import { parseQueryObject } from '@querry-kit/nest';
import { diffObjects, hasObjectDifferences, parseObject, serializeDecimalValues } from '@querry-kit/nest/object';
```

`parseObject` converts query-string values into JavaScript values and expands dotted keys.

```ts
parseObject({
  page: '1',
  enabled: 'true',
  deletedAt: 'null',
  tags: ['1', '2'],
  orderBy: '{"createdAt":"desc"}',
  'user.name': 'Ada',
});
```

`parseQueryObject` is the same normalization entry point used by `QueryService` for query-like values.

`serializeDecimalValues` recursively converts Decimal-like objects with a `toNumber()` method into numbers.

`diffObjects` and `hasObjectDifferences` compare nested objects and arrays.

`ValidationUtil.mapValidationErrorsToObject(errors)` maps class-validator errors into an object keyed by property name. It does not run validation itself.

---
'@querry-kit/nest': major
---

Remove redundant and deprecated exports: `AggregateDTOType`, `createFromPath`, `diff`, `hasDifferences`, `parse`, `parseFromObject`, `createRelationSchemaNode`, and the `./swagger` subpath.

Migrate imports to `AggregateDTO`, `createObjectFromPath`, `diffObjects`, `hasObjectDifferences`, `parseObject`, `parseObjectProperties`, `relation`, and `@querry-kit/nest/decorators`.

---
description: 'Complete CRUD controller example for @querry-kit/nest.'
---

# CRUD Controller

This controller shows a full resource shape with list, detail, create, update, and delete routes. Read endpoints use `ResourceQuery` so `fields`, Prisma-style includes, service calls, DTO mapping, and projection stay in one small pattern. Mutations use `prepareFieldsQuery` and `Fields.project` so optional `fields` works on every route without hiding domain-specific write logic.

<<< ../../examples/books-api/src/books/books.controller.ts

## Service Contract

`ResourceQuery` expects read services with the same shape as `QueryService`:

```ts
service.query<TModel>(query, ability);
service.findById<TModel>(id, query, ability);
```

Create, update, and delete stay resource-specific because they usually contain domain rules, transactions, unique checks, and relation writes.

---
description: 'Optional CASL Prisma adapter, policy helpers, and DTO field filtering.'
---

# CASL

The query service is CASL-agnostic until an app wires an accessibility resolver into it. The CASL helpers cover route policies, Prisma read filters, and field-level DTO filtering; applications retain ownership of their ability factories and subjects.

```sh
pnpm add @casl/ability @casl/prisma
```

## Service Wiring

The complete runnable service from the Books API is included below. Its `super` call wires the CASL subject and the action-aware Prisma resolver into every ability-aware read method. It also shows that a conditional write rule must be checked against the concrete record before mutating it.

<<< ../../examples/books-api/src/books/books.service.ts

For a Prisma service, replace `BookDelegate` with your generated delegate type (for example `typeof PrismaService.prototype.project`) while retaining the same `subject` and `accessibleWhere` options:

```ts
import { createCaslAccessibleWhere } from '@querry-kit/nest/casl';
import type { QueryOptionsMap } from '@querry-kit/nest/dto';
import { QueryService } from '@querry-kit/nest/query-service';

export class ProjectsService extends QueryService<
  typeof PrismaService.prototype.project,
  ProjectTypeMap,
  typeof PrismaService.prototype.project,
  QueryOptionsMap<ProjectTypeMap>,
  AppAbility,
  'Project'
> {
  constructor(prisma: PrismaService) {
    super(prisma.project, {
      subject: 'Project',
      accessibleWhere: createCaslAccessibleWhere<AppAbility, 'Project'>({ action: 'read' }),
    });
  }
}
```

Pass the current ability when calling protected read methods:

```ts
const result = await this.projectsService.query(query, req.ability);
```

CASL is optional at the controller layer too. `ResourceQuery.query` and `ResourceQuery.findById` accept `ability`, but they do not require it.

When an ability-aware DTO mapper or response policy needs relations, set them as endpoint-required includes:

```ts
return ResourceQuery.query({
  service: this.projectsService,
  query,
  schema: ProjectDTO,
  ability: req.ability,
  include: { members: true },
  map: (project, ability) => ProjectDTO.fromModel(project, ability),
});
```

Client `include` parameters extend those required includes, and `fields` adds any relation includes needed for projection.

When `query` receives both an ability and caller filters, `QueryService` merges them with `AND` so the access rule stays mandatory.

```ts
{
  AND: [
    { members: { some: { userId: currentUser.id } } },
    { archived: false }
  ]
}
```

## Policy Decorator and Guard

Use `CheckPolicies` to attach route-level policy handlers and `PoliciesGuard` to evaluate them against `request.ability`.

```ts
@Get()
@CheckPolicies((ability) => ability.can('read', 'Project'))
async query() {}
```

`PoliciesGuard` throws a Nest `ForbiddenException` when no ability is present or any policy returns `false`.

## DTO Field Filtering

Use `filterCaslFields` at the end of a DTO mapper when field permissions should affect the JSON response. It returns a shallow copy, preserves the DTO prototype, and never mutates the mapper's DTO.

```ts
import { filterCaslFields } from '@querry-kit/nest/casl';

class ProjectDTO {
  static fromModel(project: Project, ability?: AppAbility): ProjectDTO {
    const dto = Object.assign(new ProjectDTO(), {
      id: project.id,
      name: project.name,
      internalBudget: project.internalBudget,
    });

    return filterCaslFields(dto, 'Project', ability);
  }
}
```

The helper first checks the special CASL field `all`. If it is not allowed, it checks every enumerable DTO field individually. Conditional CASL rules receive the DTO as a CASL `subject`, so they can inspect its values.

DTO field filtering protects the serialized response only. Keep passing the ability to `QueryService` or `ResourceQuery` as well so the Prisma query itself is restricted.

The default action is `read`. Applications that use a differently cased or enum-backed action must pass it explicitly:

```ts
return filterCaslFields(dto, RoleSubject.PROJECT, ability, { action: RoleAction.READ });
```

## CASL Prisma Versions

`createCaslAccessibleWhere` supports CASL Prisma subject maps and the newer `accessibleBy(...).ofType(subject)` shape. The package does not export an ability factory; applications keep their own CASL module, subjects, actions, and user context.

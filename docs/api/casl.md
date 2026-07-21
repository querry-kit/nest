---
description: 'Optional CASL Prisma adapter and policy helpers.'
---

# CASL

The query service is CASL-agnostic until an app wires an accessibility resolver into it.

```sh
pnpm add @casl/ability @casl/prisma
```

## Service Wiring

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
      accessibleWhere: createCaslAccessibleWhere({ action: 'read' }),
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

## CASL Prisma Versions

`createCaslAccessibleWhere` supports CASL Prisma subject maps and the newer `accessibleBy(...).ofType(subject)` shape. The package does not export an ability factory; applications keep their own CASL module, subjects, actions, and user context.

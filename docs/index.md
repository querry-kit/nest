---
layout: home
hero:
  name: '@querry-kit/nest'
  text: Query Kit for NestJS APIs
  tagline: Fields projection, Prisma-style query services, CASL policies, decorators, pipes, pagination DTOs, and object utilities in one package.
  image:
    src: /logo.svg
    alt: '@querry-kit/nest logo'
  actions:
    - theme: brand
      text: Getting Started
      link: /guide/getting-started
    - theme: alt
      text: API Reference
      link: /api/
    - theme: alt
      text: GitHub
      link: https://github.com/querry-kit/nest
features:
  - title: Resource query facade
    icon: 🧭
    details: Replace repetitive controller glue with helpers that prepare fields, include relations, call QueryService, map DTOs, and project responses.
    link: /guide/getting-started#resource-controller
    linkText: Build a controller
  - title: Prisma and CASL
    icon: 🔐
    details: Use generic Prisma-compatible delegates with optional CASL accessibility filters.
    link: /api/casl
    linkText: Wire CASL
  - title: Fields projection
    icon: 🎯
    details: Validate requested DTO fields, load selected relations, and return only the public response shape a client asked for.
    link: /concepts/fields
    linkText: Learn fields
  - title: NestJS utilities
    icon: 🧰
    details: Share OpenAPI decorators, pipes, pagination DTOs, validation helpers, and object parsing helpers from one import.
    link: /api/openapi
    linkText: Browse utilities
---

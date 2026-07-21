---
description: 'Entry point for decorators, pipes, OpenAPI helpers, validation helpers, and object utilities.'
---

# Decorators, Pipes, Utilities

This package includes the small NestJS utilities that were previously split into focused packages. The API docs are now grouped by concern:

- [OpenAPI Decorators](/api/openapi) for `ApiResourceQuery`, `ApiPaginatedResponse`, and `ApiErrorResponses`.
- [Decorators](/api/decorators/) for route parameter and DTO property decorators.
- [Pipes](/api/pipes/) for `QueryTransformPipe` and `EmptyStringToNullPipe`.
- [Object Utilities](/api/object-utils) for object parsing, diffs, Decimal serialization, and validation helpers.

The old combined page is kept as a stable entry point for existing links.

import {
  __decorateClass,
  __decorateParam
} from "./chunk-BRKEJJFQ.js";

// src/casl/adapter.ts
import { accessibleBy } from "@casl/prisma";
function createCaslAccessibleWhere(options = {}) {
  const action = options.action ?? "read";
  return (ability, subject2) => {
    const records = accessibleBy(ability, action);
    let ofType;
    try {
      ofType = records.ofType;
    } catch {
      return records[String(subject2)];
    }
    if (typeof ofType === "function") {
      return ofType.call(records, subject2);
    }
    return records[String(subject2)];
  };
}

// src/casl/check-policies.decorator.ts
import { SetMetadata } from "@nestjs/common";
var CHECK_POLICIES_KEY = "CHECK_POLICIES";
function CheckPolicies(...handlers) {
  return SetMetadata(CHECK_POLICIES_KEY, handlers);
}

// src/casl/dto-filter.ts
import { subject } from "@casl/ability";
function filterCaslFields(dto, subjectName, ability, options = {}) {
  if (!ability) {
    return cloneDto(dto);
  }
  const action = options.action ?? "read";
  const dtoSubject = subject(subjectName, cloneDto(dto));
  if (ability.can(action, dtoSubject, "all")) {
    return cloneDto(dto);
  }
  const filtered = createDtoShell(dto);
  const dtoFields = dto;
  const filteredFields = filtered;
  for (const key of Object.keys(dto)) {
    if (ability.can(action, dtoSubject, key)) {
      filteredFields[key] = dtoFields[key];
    }
  }
  return filtered;
}
function cloneDto(dto) {
  return Object.assign(createDtoShell(dto), dto);
}
function createDtoShell(dto) {
  return Object.create(Object.getPrototypeOf(dto));
}

// src/casl/policies.guard.ts
import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
var PoliciesGuard = class {
  /**
   * Creates a policies guard.
   *
   * @param {Reflector} reflector Nest reflector used to read route metadata.
   */
  constructor(reflector) {
    this.reflector = reflector;
  }
  reflector;
  /**
   * Checks all policies configured through {@link CheckPolicies}.
   *
   * @param {ExecutionContext} context Nest execution context.
   * @returns {boolean} True when all policies pass.
   * @throws {ForbiddenException} When ability is missing or a policy fails.
   */
  canActivate(context) {
    const handlers = this.reflector.get(CHECK_POLICIES_KEY, context.getHandler()) ?? [];
    if (handlers.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!request.ability) {
      throw new ForbiddenException("Insufficient permissions.");
    }
    if (!handlers.every((handler) => handler(request.ability))) {
      throw new ForbiddenException("Insufficient permissions.");
    }
    return true;
  }
};
PoliciesGuard = __decorateClass([
  Injectable(),
  __decorateParam(0, Inject(Reflector))
], PoliciesGuard);

export {
  CHECK_POLICIES_KEY,
  CheckPolicies,
  filterCaslFields,
  createCaslAccessibleWhere,
  PoliciesGuard
};
//# sourceMappingURL=chunk-26ANA2D3.js.map
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/casl/index.ts
var casl_exports = {};
__export(casl_exports, {
  CHECK_POLICIES_KEY: () => CHECK_POLICIES_KEY,
  CheckPolicies: () => CheckPolicies,
  PoliciesGuard: () => PoliciesGuard,
  createCaslAccessibleWhere: () => createCaslAccessibleWhere
});
module.exports = __toCommonJS(casl_exports);

// src/casl/adapter.ts
var import_prisma = require("@casl/prisma");
function createCaslAccessibleWhere(options = {}) {
  const action = options.action ?? "read";
  return (ability, subject) => {
    const records = (0, import_prisma.accessibleBy)(ability, action);
    if (typeof records.ofType === "function") {
      return records.ofType(subject);
    }
    return records[String(subject)];
  };
}

// src/casl/check-policies.decorator.ts
var import_common = require("@nestjs/common");
var CHECK_POLICIES_KEY = "CHECK_POLICIES";
function CheckPolicies(...handlers) {
  return (0, import_common.SetMetadata)(CHECK_POLICIES_KEY, handlers);
}

// src/casl/policies.guard.ts
var import_common2 = require("@nestjs/common");
var import_core = require("@nestjs/core");
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
      throw new import_common2.ForbiddenException("Insufficient permissions.");
    }
    if (!handlers.every((handler) => handler(request.ability))) {
      throw new import_common2.ForbiddenException("Insufficient permissions.");
    }
    return true;
  }
};
PoliciesGuard = __decorateClass([
  (0, import_common2.Injectable)(),
  __decorateParam(0, (0, import_common2.Inject)(import_core.Reflector))
], PoliciesGuard);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CHECK_POLICIES_KEY,
  CheckPolicies,
  PoliciesGuard,
  createCaslAccessibleWhere
});
//# sourceMappingURL=casl.cjs.map
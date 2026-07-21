import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY, type PolicyHandler } from './check-policies.decorator';

type RequestWithAbility = {
  ability?: unknown;
};

/**
 * Generic CASL policies guard for HTTP controllers.
 */
@Injectable()
export class PoliciesGuard implements CanActivate {
  /**
   * Creates a policies guard.
   *
   * @param {Reflector} reflector Nest reflector used to read route metadata.
   */
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

  /**
   * Checks all policies configured through {@link CheckPolicies}.
   *
   * @param {ExecutionContext} context Nest execution context.
   * @returns {boolean} True when all policies pass.
   * @throws {ForbiddenException} When ability is missing or a policy fails.
   */
  canActivate(context: ExecutionContext): boolean {
    const handlers = this.reflector.get<PolicyHandler[]>(CHECK_POLICIES_KEY, context.getHandler()) ?? [];
    if (handlers.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAbility>();
    if (!request.ability) {
      throw new ForbiddenException('Insufficient permissions.');
    }

    if (!handlers.every((handler) => handler(request.ability))) {
      throw new ForbiddenException('Insufficient permissions.');
    }

    return true;
  }
}

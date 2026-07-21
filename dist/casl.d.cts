import { AnyAbility } from '@casl/ability';
import { A as AccessibleWhereResolver } from './query-service.types-B4FRCOQf.cjs';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Options for {@link createCaslAccessibleWhere}.
 */
type CaslAccessibleWhereOptions<TAction = string> = {
    /** CASL action passed to `accessibleBy`. Defaults to `read`. */
    action?: TAction;
};
/**
 * Creates an access-control resolver backed by `@casl/prisma`.
 *
 * @param options Adapter options.
 * @returns Generic query-service access resolver.
 */
declare function createCaslAccessibleWhere<TAbility = AnyAbility, TSubject = string, TAction = string>(options?: CaslAccessibleWhereOptions<TAction>): AccessibleWhereResolver<TAbility, TSubject>;

/**
 * Handler used by {@link CheckPolicies}.
 */
type PolicyHandler<TAbility = unknown> = (ability: TAbility) => boolean;
/**
 * Metadata key used by {@link CheckPolicies} and {@link PoliciesGuard}.
 */
declare const CHECK_POLICIES_KEY = "CHECK_POLICIES";
/**
 * Stores one or more policy handlers on a route handler.
 *
 * @param {PolicyHandler<TAbility>[]} handlers Policy handlers evaluated by PoliciesGuard.
 * @returns {MethodDecorator & ClassDecorator} Nest metadata decorator.
 */
declare function CheckPolicies<TAbility = unknown>(...handlers: PolicyHandler<TAbility>[]): MethodDecorator & ClassDecorator;

/**
 * Generic CASL policies guard for HTTP controllers.
 */
declare class PoliciesGuard implements CanActivate {
    private readonly reflector;
    /**
     * Creates a policies guard.
     *
     * @param {Reflector} reflector Nest reflector used to read route metadata.
     */
    constructor(reflector: Reflector);
    /**
     * Checks all policies configured through {@link CheckPolicies}.
     *
     * @param {ExecutionContext} context Nest execution context.
     * @returns {boolean} True when all policies pass.
     * @throws {ForbiddenException} When ability is missing or a policy fails.
     */
    canActivate(context: ExecutionContext): boolean;
}

export { CHECK_POLICIES_KEY, type CaslAccessibleWhereOptions, CheckPolicies, PoliciesGuard, type PolicyHandler, createCaslAccessibleWhere };

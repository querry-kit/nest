import { AnyAbility } from '@casl/ability';
import { A as AccessibleWhereResolver } from './query-service.types-B4FRCOQf.js';
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
 * Ability shape required for {@link filterCaslFields}.
 */
type CaslFieldAbility<TAction extends string = string> = {
    /** Checks whether an action is allowed for a subject or one of its fields. */
    can(action: TAction, subject: unknown, field?: string): boolean;
};
/**
 * Options for {@link filterCaslFields}.
 */
type CaslDtoFilterOptions<TAction extends string = string> = {
    /** CASL action used for field checks. Defaults to `read`. */
    action?: TAction;
};
/**
 * Returns a shallow DTO copy containing only fields readable through a CASL ability.
 *
 * A permission for the special `all` field keeps every enumerable DTO field. The
 * DTO is wrapped with CASL's {@link subject} helper before individual fields are
 * checked, so conditional rules can inspect its values. The input DTO is never
 * mutated.
 *
 * @param {TDto} dto DTO whose enumerable fields should be filtered.
 * @param {TSubject} subjectName CASL subject name assigned to the DTO for checks.
 * @param {CaslFieldAbility<TAction>} [ability] Ability used to evaluate field access.
 * @param {CaslDtoFilterOptions<TAction>} [options] Optional CASL action configuration.
 * @returns {TDto} A shallow DTO copy containing only readable fields.
 */
declare function filterCaslFields<TDto extends object, TSubject extends string = string, TAction extends string = string>(dto: TDto, subjectName: TSubject, ability?: CaslFieldAbility<TAction>, options?: CaslDtoFilterOptions<TAction>): TDto;

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

export { CHECK_POLICIES_KEY, type CaslAccessibleWhereOptions, type CaslDtoFilterOptions, type CaslFieldAbility, CheckPolicies, PoliciesGuard, type PolicyHandler, createCaslAccessibleWhere, filterCaslFields };

import { SetMetadata } from '@nestjs/common';

/**
 * Handler used by {@link CheckPolicies}.
 */
export type PolicyHandler<TAbility = unknown> = (ability: TAbility) => boolean;

/**
 * Metadata key used by {@link CheckPolicies} and {@link PoliciesGuard}.
 */
export const CHECK_POLICIES_KEY = 'CHECK_POLICIES';

/**
 * Stores one or more policy handlers on a route handler.
 *
 * @param {PolicyHandler<TAbility>[]} handlers Policy handlers evaluated by PoliciesGuard.
 * @returns {MethodDecorator & ClassDecorator} Nest metadata decorator.
 */
export function CheckPolicies<TAbility = unknown>(
  ...handlers: PolicyHandler<TAbility>[]
): MethodDecorator & ClassDecorator {
  return SetMetadata(CHECK_POLICIES_KEY, handlers);
}

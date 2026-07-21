import { ForbiddenException } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { CHECK_POLICIES_KEY, CheckPolicies } from './check-policies.decorator';
import { PoliciesGuard } from './policies.guard';

type Handler = () => void;

function createContext(handler: Handler, ability?: unknown) {
  return {
    getHandler: () => handler,
    switchToHttp: () => ({
      getRequest: () => ({ ability }),
    }),
  };
}

describe('CheckPolicies and PoliciesGuard', () => {
  it('stores policy handlers under the shared metadata key', () => {
    const handler = jest.fn();
    const decorator = CheckPolicies(handler);

    expect(decorator).toBeDefined();
    expect(CHECK_POLICIES_KEY).toBe('CHECK_POLICIES');
  });

  it('accepts successful policies', () => {
    const routeHandler = jest.fn();
    const ability = { can: true };
    const reflector = {
      get: jest.fn().mockReturnValue([jest.fn().mockReturnValue(true)]),
    } as unknown as Reflector;
    const guard = new PoliciesGuard(reflector);

    expect(guard.canActivate(createContext(routeHandler, ability) as never)).toBe(true);
    expect(reflector.get).toHaveBeenCalledWith(CHECK_POLICIES_KEY, routeHandler);
  });

  it('accepts routes without policy handlers', () => {
    const reflector = {
      get: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const guard = new PoliciesGuard(reflector);

    expect(guard.canActivate(createContext(jest.fn()) as never)).toBe(true);
  });

  it('throws forbidden exceptions when ability is missing or a policy fails', () => {
    const reflector = {
      get: jest.fn().mockReturnValue([jest.fn().mockReturnValue(false)]),
    } as unknown as Reflector;
    const guard = new PoliciesGuard(reflector);

    expect(() => guard.canActivate(createContext(jest.fn()) as never)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(createContext(jest.fn(), { can: false }) as never)).toThrow(ForbiddenException);
  });
});

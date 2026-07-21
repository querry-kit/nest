import type { AnyAbility } from '@casl/ability';
import { accessibleBy } from '@casl/prisma';
import type { AccessibleWhereResolver } from '../query-service/query.service.js';

/**
 * Options for {@link createCaslAccessibleWhere}.
 */
export type CaslAccessibleWhereOptions<TAction = string> = {
  /** CASL action passed to `accessibleBy`. Defaults to `read`. */
  action?: TAction;
};

/**
 * Creates an access-control resolver backed by `@casl/prisma`.
 *
 * @param options Adapter options.
 * @returns Generic query-service access resolver.
 */
export function createCaslAccessibleWhere<TAbility = AnyAbility, TSubject = string, TAction = string>(
  options: CaslAccessibleWhereOptions<TAction> = {},
): AccessibleWhereResolver<TAbility, TSubject> {
  const action = options.action ?? ('read' as TAction);

  return (ability, subject) => {
    const records = (accessibleBy as (ability: unknown, action: unknown) => AccessibleRecordsLike)(ability, action);
    if (typeof records.ofType === 'function') {
      return records.ofType(subject);
    }

    return records[String(subject)];
  };
}

type AccessibleRecordsLike = Record<string, unknown> & {
  ofType?: (subject: unknown) => unknown;
};

/**
 * Resolves an access-control where clause for a subject.
 *
 * The returned value is merged with caller-provided filters as
 * `{ AND: [accessibleWhere, parsedWhere] }`.
 *
 * @param ability Application ability object.
 * @param subject Subject configured on the query service.
 * @returns Prisma-compatible where input limiting accessible records.
 */
type AccessibleWhereResolver<TAbility = unknown, TSubject = unknown> = (ability: TAbility, subject: TSubject) => unknown;
/**
 * Options accepted by query services.
 */
type QueryServiceOptions<TAbility = unknown, TSubject = unknown> = {
    /** Subject passed to `accessibleWhere`, for example a CASL Prisma subject name. */
    subject?: TSubject;
    /** Optional resolver returning a Prisma-compatible access-control where input. */
    accessibleWhere?: AccessibleWhereResolver<TAbility, TSubject>;
    /** Optional logger for unexpected delegate errors before they are masked as 500 responses. */
    errorLogger?: Pick<Console, 'error'>;
};

export type { AccessibleWhereResolver as A, QueryServiceOptions as Q };

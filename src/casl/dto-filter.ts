import { subject } from '@casl/ability';

/**
 * Ability shape required for {@link filterCaslFields}.
 */
export type CaslFieldAbility<TAction extends string = string> = {
  /** Checks whether an action is allowed for a subject or one of its fields. */
  can(action: TAction, subject: unknown, field?: string): boolean;
};

/**
 * Options for {@link filterCaslFields}.
 */
export type CaslDtoFilterOptions<TAction extends string = string> = {
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
export function filterCaslFields<
  TDto extends object,
  TSubject extends string = string,
  TAction extends string = string,
>(
  dto: TDto,
  subjectName: TSubject,
  ability?: CaslFieldAbility<TAction>,
  options: CaslDtoFilterOptions<TAction> = {},
): TDto {
  if (!ability) {
    return cloneDto(dto);
  }

  const action = options.action ?? ('read' as TAction);
  const dtoSubject = subject(subjectName, cloneDto(dto) as Record<string, unknown>);

  if (ability.can(action, dtoSubject, 'all')) {
    return cloneDto(dto);
  }

  const filtered = createDtoShell(dto);
  const dtoFields = dto as Record<string, unknown>;
  const filteredFields = filtered as Record<string, unknown>;
  for (const key of Object.keys(dto)) {
    if (ability.can(action, dtoSubject, key)) {
      filteredFields[key] = dtoFields[key];
    }
  }

  return filtered;
}

function cloneDto<TDto extends object>(dto: TDto): TDto {
  return Object.assign(createDtoShell(dto), dto);
}

function createDtoShell<TDto extends object>(dto: TDto): TDto {
  return Object.create(Object.getPrototypeOf(dto)) as TDto;
}

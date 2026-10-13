import { z } from 'zod';

/** Options for finding the first matching item; Prisma values are not validated. */
export const FindOneSchema = z.object({
  select: z.unknown().optional(),
  include: z.unknown().optional(),
  where: z.unknown().optional(),
  orderBy: z.unknown().optional(),
  cursor: z.unknown().optional(),
  distinct: z.unknown().optional(),
});

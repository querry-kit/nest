import { z } from 'zod';

/** Projection options for finding an item by ID. Prisma values require application-specific schemas. */
export const FindByIdSchema = z.object({
  fields: z.string().optional(),
  select: z.unknown().optional(),
  include: z.unknown().optional(),
});

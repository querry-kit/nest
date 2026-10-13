import { z } from 'zod';

import { skipSchema } from './skip.schema.js';
import { takeSchema } from './take.schema.js';

/** Aggregate options with validated take and skip; Prisma selectors remain unvalidated. */
export const AggregateSchema = z.object({
  where: z.unknown().optional(),
  orderBy: z.unknown().optional(),
  cursor: z.unknown().optional(),
  take: takeSchema,
  skip: skipSchema,
  _count: z.unknown().optional(),
  _min: z.unknown().optional(),
  _max: z.unknown().optional(),
  _avg: z.unknown().optional(),
  _sum: z.unknown().optional(),
});

import { z } from 'zod';

import { integerQuerySchema } from './integer-query.schema.js';

/** Pagination input with numeric query-string conversion and defaults. */
export const PageOptionsSchema = z.object({
  page: integerQuerySchema.pipe(z.number().int().min(1)).default(1),
  perPage: integerQuerySchema.pipe(z.number().int().min(1).max(1000)).default(10),
});

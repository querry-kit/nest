import { z } from 'zod';

import { integerQuerySchema } from './integer-query.schema.js';

/** Optional non-negative integer offset with query-string conversion. */
export const skipSchema = integerQuerySchema.pipe(z.number().int().min(0)).optional();

import { z } from 'zod';

import { integerQuerySchema } from './integer-query.schema.js';

/** Optional positive integer limit with query-string conversion. */
export const takeSchema = integerQuerySchema.pipe(z.number().int().min(1)).optional();

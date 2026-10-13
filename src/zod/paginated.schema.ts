import { z } from 'zod';

import { PageMetaSchema } from './page-meta.schema.js';

/**
 * Creates a schema for the public paginated response envelope.
 *
 * @param {T} itemSchema Schema used to validate each response item.
 * @returns {z.ZodObject<{ items: z.ZodArray<T>; meta: typeof PageMetaSchema }>} Paginated response schema.
 */
export function createPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({ items: z.array(itemSchema), meta: PageMetaSchema });
}

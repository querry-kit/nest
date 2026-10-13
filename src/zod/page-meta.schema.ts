import { z } from 'zod';

/** Pagination response metadata; validates values without computing or cross-checking them. */
export const PageMetaSchema = z.object({
  page: z.number().int().min(1),
  perPage: z.number().int().min(1).max(1000),
  itemCount: z.number().int().min(0),
  pageCount: z.number().int().min(0),
  hasPrevPage: z.boolean(),
  hasNextPage: z.boolean(),
});

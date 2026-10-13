import { z } from 'zod';

import { FindOneSchema } from './find-one.schema.js';
import { PageOptionsSchema } from './page-options.schema.js';

/** Paginated resource query with projection, pagination defaults and unvalidated Prisma values. */
export const QuerySchema = FindOneSchema.extend({
  ...PageOptionsSchema.shape,
  fields: z.string().optional(),
});

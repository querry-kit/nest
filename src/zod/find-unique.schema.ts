import { z } from 'zod';

import { FindByIdSchema } from './find-by-id.schema.js';

/** Unique lookup options; like the existing DTO, the base schema does not require where. */
export const FindUniqueSchema = FindByIdSchema.extend({ where: z.unknown().optional() });

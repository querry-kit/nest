import { z } from 'zod';

/** Accepts numbers and non-empty numeric query strings before range validation. */
export const integerQuerySchema = z.union([z.number(), z.string().trim().min(1)]).pipe(z.coerce.number());

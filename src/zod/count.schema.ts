import { z } from 'zod';

/** Count options; the application must validate the Prisma where input. */
export const CountSchema = z.object({ where: z.unknown().optional() });

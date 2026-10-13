import { FindOneSchema } from './find-one.schema.js';
import { skipSchema } from './skip.schema.js';
import { takeSchema } from './take.schema.js';

/** List options with validated take and skip values. */
export const FindManySchema = FindOneSchema.extend({ take: takeSchema, skip: skipSchema });

import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum([ 'development', 'production' ]).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
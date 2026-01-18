import * as z from 'zod';

export const envSchema = z.object({
  CORS_ORIGIN: z.url(),
  VALKEY_CONNECTION_STRING: z.string(),
});
export type EnvVariables = z.infer<typeof envSchema>;

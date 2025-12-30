import * as z from 'zod';

export const envSchema = z.object({
  AUTH0_DOMAIN: z.string(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  AUTH0_CALLBACK_URL: z.url(),
  AUTH0_AUDIENCE: z.string(),
  AUTH0_MANAGEMENT_API_IDENTIFIER: z.url(),
  AUTH0_REDIRECT_URL: z.url(),
  AUTH0_LOGIN_REDIRECT_URL: z.url(),
  STATE_COOKIE_NAME: z.string(),
  CORS_ORIGIN: z.url(),
});
export type EnvVariables = z.infer<typeof envSchema>;

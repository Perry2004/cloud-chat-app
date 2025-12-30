import * as z from "zod";

export const envSchema = z.object({
  VITE_AUTH0_DOMAIN: z.string(),
  VITE_AUTH0_CLIENT_ID: z.string(),
  VITE_AUTH0_CALLBACK_URL: z.url(),
  VITE_API_BASE_URL: z.url(),
});
export type EnvVariables = z.infer<typeof envSchema>;

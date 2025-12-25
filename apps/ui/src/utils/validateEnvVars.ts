import { envSchema } from "./schema";

export function validateEnvVars() {
  envSchema.parse(import.meta.env);
  console.log("Validating env vars...");
}

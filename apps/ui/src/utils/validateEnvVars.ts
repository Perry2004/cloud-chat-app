import { envSchema, EnvVariables } from "./schema";

function validateEnvVars(): EnvVariables {
  return envSchema.parse(import.meta.env);
}

export const validatedEnv = validateEnvVars();

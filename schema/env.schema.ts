import { z } from "zod";
import { logger } from "@/lib/logger.library";

export const envServerSchema = z.object({
  // Application Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Secret
  PASSWORD_SECRET: z.string().transform((v) => Buffer.from(v, "hex")),

  // Database & Connection
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  PORT: z.string().default("3000"),
  // Third Party Integration (Resend)
  RESEND_API_KEY: z
    .string()
    .startsWith("re_", "RESEND_API_KEY must start with 're_'"),

  // Redis Configuration
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  // Admin Configuration
  ADMIN_EMAIL: z.email("Invalid Super Admin email format"),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "Super Admin password must be at least 8 characters"),
  NEXTAUTH_SECRET: z.string(),
});

export const envClientSchema = z.object({});

export type EnvServer = z.infer<typeof envServerSchema>;
export type EnvClient = z.infer<typeof envClientSchema>;
/**
 * Validates and loads environment variables.
 * If validation fails, it prints a clean error report and exits the process.
 */
export function loadEnvServer(): EnvServer {
  const parsed = envServerSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error("❌ Invalid Server Environment Variables:");

    // Extract field-specific errors for better readability
    const errors = z.prettifyError(parsed.error);
    logger.error(errors);

    // Force exit if the environment is not valid
    process.exit(1);
  }

  // Object.freeze ensures the env variables are immutable during runtime
  return Object.freeze(parsed.data);
}

export function loadEnvClient(): EnvClient {
  if (typeof window !== "undefined") {
    throw new Error(" Server environment imported in client component");
  }
  const parsed = envClientSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error("❌ Invalid Client Environment Variables:");

    // Extract field-specific errors for better readability
    const errors = z.prettifyError(parsed.error);
    logger.error(errors);

    // Force exit if the environment is not valid
    process.exit(1);
  }

  // Object.freeze ensures the env variables are immutable during runtime
  return Object.freeze(parsed.data);
}
// Global ENV constant
export const ENV_SERVER = loadEnvServer();
export const ENV_CLIENT = loadEnvClient();

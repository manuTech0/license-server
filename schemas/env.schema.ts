import { z } from "zod";
import { logger } from "@/lib/logger.library";

export const envSchema = z.object({
  // Application Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database & Connection
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DOMAIN: z.string().min(1, "DOMAIN cannot be empty"),
  PORT: z.string().default("3000"),
  // Third Party Integration (Resend)
  RESEND_API_KEY: z
    .string()
    .startsWith("re_", "RESEND_API_KEY must start with 're_'"),

  // Redis Configuration
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  // Admin Configuration
  ADMIN_EMAIL: z.string().email("Invalid Super Admin email format"),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "Super Admin password must be at least 8 characters"),
  NEXTAUTH_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates and loads environment variables.
 * If validation fails, it prints a clean error report and exits the process.
 */
export default function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    logger.error("❌ Invalid Environment Variables:");

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
export const ENV = loadEnv();

import { z } from "zod";
import { fromError } from "zod-validation-error";

const envSchema = z.object({
  VITE_APP_ID: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET should be at least 32 characters"),
  DATABASE_URL: z.string().url(),
  OAUTH_SERVER_URL: z.string().url(),
  OWNER_OPEN_ID: z.string().min(1),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().default("587").transform(Number),
  EMAIL_SECURE: z.string().default("false").transform(v => v === "true"),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  GOOGLE_CLIENT_EMAIL: z.string().email().optional(),
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  BUILT_IN_FORGE_API_URL: z.string().optional(),
  BUILT_IN_FORGE_API_KEY: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(fromError(_env.error).toString());
  process.exit(1);
}

export const ENV = {
  appId: _env.data.VITE_APP_ID,
  cookieSecret: _env.data.JWT_SECRET,
  databaseUrl: _env.data.DATABASE_URL,
  oAuthServerUrl: _env.data.OAUTH_SERVER_URL,
  ownerOpenId: _env.data.OWNER_OPEN_ID,
  emailHost: _env.data.EMAIL_HOST ?? "",
  emailPort: _env.data.EMAIL_PORT,
  emailSecure: _env.data.EMAIL_SECURE,
  emailUser: _env.data.EMAIL_USER ?? "",
  emailPassword: _env.data.EMAIL_PASSWORD ?? "",
  emailFrom: _env.data.EMAIL_FROM ?? "",
  adminEmail: _env.data.ADMIN_EMAIL ?? "admin@newswindon.com",
  isProduction: _env.data.NODE_ENV === "production",
  forgeApiUrl: _env.data.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: _env.data.BUILT_IN_FORGE_API_KEY ?? "",
  GOOGLE_CLIENT_EMAIL: _env.data.GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: _env.data.GOOGLE_PRIVATE_KEY,
};

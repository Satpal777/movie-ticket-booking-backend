import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8000'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().min(1),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
  EMAIL_HOST: z.string().min(1),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string().min(1),
  NO_REPLY_EMAIL: z.string().min(1),
  EMAIL_PASS: z.string().min(1),
  CLIENT_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);

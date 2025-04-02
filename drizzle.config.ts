import { loadEnvConfig } from '@next/env';
const { combinedEnv } = loadEnvConfig(process.cwd());
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_APP_NEON_DATABASE_URL!,
  },
});

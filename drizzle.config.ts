import { loadEnvConfig } from '@next/env';

import { defineConfig } from 'drizzle-kit';

const { combinedEnv } = loadEnvConfig(process.cwd());
console.log('hello', loadEnvConfig(process.cwd()));

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: combinedEnv.NEXT_APP_NEON_DATABASE_URL!,
  },
});

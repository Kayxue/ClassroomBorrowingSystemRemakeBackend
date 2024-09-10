import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './schema.ts',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL_DRIZZLE,
  },
});

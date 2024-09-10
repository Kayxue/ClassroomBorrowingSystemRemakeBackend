import { defineConfig } from 'drizzle-kit';
import { DrizzleORMUrl } from 'src/Config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './schema.ts',
  out: './migrations',
  dbCredentials: {
    url: DrizzleORMUrl
  },
});

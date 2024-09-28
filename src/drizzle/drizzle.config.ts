import { defineConfig } from "drizzle-kit";
import { DrizzleORMUrl, MySQLUrl } from "src/Config";

export default defineConfig({
	dialect: "mysql",
	schema: "./schema.ts",
	out: "./migrations",
	dbCredentials: {
		url: MySQLUrl,
	},
});

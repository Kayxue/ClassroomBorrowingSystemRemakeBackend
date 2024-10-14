import { defineConfig } from "drizzle-kit";
import { MySQLUrl } from "../Config.ts";

export default defineConfig({
	dialect: "mysql",
	schema: "./schema.ts",
	out: "./migrations",
	dbCredentials: {
		url: MySQLUrl,
	},
});

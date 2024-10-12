import { Module } from "@nestjs/common";
import { UserController } from "./user.controller.ts";
import { UserService } from "./user.service.ts";
import { DrizzleMySqlModule } from "@knaadh/nestjs-drizzle-mysql2";
import { DrizzleORMUrl, MySQLConfig } from "../Config.ts";
import * as schema from "../drizzle/schema.ts";

@Module({
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
	imports: [
		DrizzleMySqlModule.register({
			tag: "drizzledb",
			mysql: {
				connection: "client",
				config: {
					...MySQLConfig,
				},
			},
			config: { schema: { ...schema }, mode: "default" },
		}),
	],
})
export class UserModule {}

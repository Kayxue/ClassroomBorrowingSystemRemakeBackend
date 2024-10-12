import { Module } from "@nestjs/common";
import { BorrowController } from "./borrow.controller.ts";
import { BorrowService } from "./borrow.service.ts";
import { DrizzleORMUrl, MySQLConfig } from "../Config.ts";
import * as schema from "../drizzle/schema.ts";
import { DrizzleMySqlModule } from "@knaadh/nestjs-drizzle-mysql2";

@Module({
	controllers: [BorrowController],
	providers: [BorrowService],
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
export class BorrowModule {}

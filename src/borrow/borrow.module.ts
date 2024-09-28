import { Module } from "@nestjs/common";
import { BorrowController } from "./borrow.controller";
import { BorrowService } from "./borrow.service";
import { DrizzleORMUrl, MySQLConfig } from "src/Config";
import * as schema from "../drizzle/schema";
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

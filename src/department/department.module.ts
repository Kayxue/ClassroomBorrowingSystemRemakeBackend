import { Module } from "@nestjs/common";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";
import { DrizzleMySqlModule } from "@knaadh/nestjs-drizzle-mysql2";
import { MySQLConfig } from "../Config";
import * as schema from "../drizzle/schema";

@Module({
	controllers: [DepartmentController],
	providers: [DepartmentService],
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
export class DepartmentModule {}

import { Module } from "@nestjs/common";
import { ClassroomService } from "./classroom.service.ts";
import { ClassroomController } from "./classroom.controller.ts";
import { MySQLConfig } from "../Config.ts";
import * as schema from "../drizzle/schema.ts";
import { DrizzleMySqlModule } from "@knaadh/nestjs-drizzle-mysql2";

@Module({
	providers: [ClassroomService],
	controllers: [ClassroomController],
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
export class ClassroomModule {}

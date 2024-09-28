import { Module } from "@nestjs/common";
import { ClassroomService } from "./classroom.service";
import { ClassroomController } from "./classroom.controller";
import { DrizzleORMUrl, MySQLConfig } from "src/Config";
import * as schema from "../drizzle/schema";
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

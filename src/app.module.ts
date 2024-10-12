import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.ts";
import { AppService } from "./app.service.ts";
import { AuthModule } from "./auth/auth.module.ts";
import { UserModule } from "./user/user.module.ts";
import { ClassroomModule } from "./classroom/classroom.module.ts";
import { BorrowModule } from "./borrow/borrow.module.ts";
import { DepartmentModule } from './department/department.module.ts';

@Module({
	imports: [AuthModule, UserModule, ClassroomModule, BorrowModule, DepartmentModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

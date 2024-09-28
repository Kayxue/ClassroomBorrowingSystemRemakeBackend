import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ClassroomModule } from "./classroom/classroom.module";
import { BorrowModule } from "./borrow/borrow.module";

@Module({
	imports: [AuthModule, UserModule, ClassroomModule, BorrowModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ClassroomModule } from './classroom/classroom.module';

@Module({
  imports: [AuthModule, UserModule, ClassroomModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

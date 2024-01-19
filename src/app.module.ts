import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [AuthModule, UserModule, PrismaModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AuthService, UserService],
})
export class AppModule {}

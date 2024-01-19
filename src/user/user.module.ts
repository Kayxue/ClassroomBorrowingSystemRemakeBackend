import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports:[PrismaModule.forRoot()],
  controllers: [UserController],
  providers:[UserService]
})
export class UserModule {}

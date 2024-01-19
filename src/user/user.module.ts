import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Module({
  controllers: [UserController],
  providers:[UserService,PrismaService],
  exports:[UserService]
})
export class UserModule {}

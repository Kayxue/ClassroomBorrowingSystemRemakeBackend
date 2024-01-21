import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Module({
  providers: [ClassroomService, PrismaService],
  controllers: [ClassroomController]
})
export class ClassroomModule { }

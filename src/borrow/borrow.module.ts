import { Module } from '@nestjs/common';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Module({
  controllers: [BorrowController],
  providers: [BorrowService, PrismaService]
})
export class BorrowModule { }

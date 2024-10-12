import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller.ts';
import { DepartmentService } from './department.service.ts';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule {}

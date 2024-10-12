import { Controller, Get, Post } from '@nestjs/common';
import { DepartmentService } from "./department.service.ts";

@Controller('department')
export class DepartmentController {
    public constructor(private departmentService:DepartmentService){}

    @Post("/addDepartment")
    public async addDepartment(){
        return "Hello"
    }
}

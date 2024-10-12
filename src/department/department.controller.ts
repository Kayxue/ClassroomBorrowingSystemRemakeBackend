import { Controller, Post } from "@nestjs/common";
import type { DepartmentService } from "./department.service.ts";

@Controller("department")
export class DepartmentController {
	public constructor(private departmentService: DepartmentService) {}

	@Post("addDepartment")
	public async addDepartment() {}
}

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { DepartmentService } from "./department.service.ts";
import type { InsertDepartmentData } from "../Types/RequestBody.dto.ts";
import { RequireAdminGuard } from "../user/user.requireAdminGuard.guard.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";

@Controller("department")
export class DepartmentController {
	public constructor(private departmentService: DepartmentService) {}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/addDepartment")
	public async addDepartment(@Body() departmentData: InsertDepartmentData) {
		return this.departmentService.insertDepartment(departmentData);
	}
}

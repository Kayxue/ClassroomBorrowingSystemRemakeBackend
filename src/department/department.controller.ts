import { Body, Controller, Post, UseGuards, Delete, Get } from "@nestjs/common";
import { DepartmentService } from "./department.service.ts";
import type {
	DeleteDepartmentData,
	InsertDepartmentData,
	UpdateDepartmentData,
} from "../Types/RequestBody.dto.ts";
import { RequireAdminGuard } from "../user/user.requireAdminGuard.guard.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";

@Controller("department")
export class DepartmentController {
	public constructor(private departmentService: DepartmentService) {}

	@UseGuards(AuthenticatedGuard)
	@Get("/getAllDepartments")
	public async getAllDepartments() {
		return this.departmentService.getAllDepartments();
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/addDepartment")
	public async addDepartment(@Body() departmentData: InsertDepartmentData) {
		return this.departmentService.insertDepartment(departmentData);
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Delete("/deleteDepartment")
	public async deleteDepartment(@Body() deleteDepartmentData: DeleteDepartmentData) {
		return this.departmentService.deleteDepartment(deleteDepartmentData);
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/updateDepartment")
	public async updateDepartment(@Body() updateDepartmentData: UpdateDepartmentData) {
		return this.departmentService.updateDepartment(updateDepartmentData);
	}
}

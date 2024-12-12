import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
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

	@Get("/getAllDepartments")
	public async getAllDepartments() {
		return this.departmentService.getAllDepartments();
	}

	@UseGuards(AuthenticatedGuard)
	@Get("getDepartment/:id")
	public async getDepartment(
		@Param("id") id: string,
		@Query("members", new ParseBoolPipe({ optional: true })) members: boolean,
	) {
		return this.departmentService.getDepartment(id, members);
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
	public async deleteDepartment(
		@Body() deleteDepartmentData: DeleteDepartmentData,
	) {
		return this.departmentService.deleteDepartment(deleteDepartmentData);
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/updateDepartment")
	public async updateDepartment(
		@Body() updateDepartmentData: UpdateDepartmentData,
	) {
		return this.departmentService.updateDepartment(updateDepartmentData);
	}
}

import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ClassroomService } from "./classroom.service.ts";
import {
	DeleteClassroomData,
	InsertClassroomData,
	UpdateClassroomData,
} from "../Types/RequestBody.dto.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";
import { RequireAdminGuard } from "../user/user.requireAdminGuard.guard.ts";
import { partActionsLoginRequiredGuard } from "../auth/user.partActionsLoginRequired.guard.ts";

@Controller("classroom")
export class ClassroomController {
	public constructor(private classroomService: ClassroomService) {}

	@UseGuards(new partActionsLoginRequiredGuard(["borrows", true]))
	@Get("/getClassroom/:id")
	public async getClassroom(
		@Param("id") classroomId: string,
		@Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean,
	) {
		return (
			(await this.classroomService.getClassroom(classroomId, borrows)) ?? {}
		);
	}

	@UseGuards(new partActionsLoginRequiredGuard(["borrows", true]))
	@Get("/getClassrooms")
	public async getClassrooms(
		@Query("borrows", new ParseBoolPipe({ optional: true })) borrows?: boolean,
	) {
		return this.classroomService.getClassrooms(borrows);
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Post("/addClassroom")
	public async addClassroom(@Body() classroomData: InsertClassroomData) {
		return (await this.classroomService.insertClassroom(classroomData))[0];
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Patch("/updateClassroom")
	public async updateClassroom(@Body() classroomData: UpdateClassroomData) {
		return (await this.classroomService.updateClassroomData(classroomData))[0];
	}

	@UseGuards(RequireAdminGuard)
	@UseGuards(AuthenticatedGuard)
	@Delete("deleteClassroom")
	public async deleteClassroom(@Body() classroomData: DeleteClassroomData) {
		return this.classroomService.deleteClassroomData(classroomData);
	}
}

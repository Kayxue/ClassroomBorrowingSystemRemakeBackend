import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	Patch,
	Post,
	Query,
	Request,
	Session,
	UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service.ts";
import {
	DeleteUserData,
	InsertUserData,
	UpdateUserData,
	UpdateUserPasswordData,
} from "../Types/RequestBody.dto.ts";
import { LocalAuthGuard } from "../auth/local.auth.guard.ts";
import { AuthenticatedGuard } from "../auth/authenticated.guard.ts";
import { Roles } from "../Types/Types.ts";
import { CheckSelfUserActionGuard } from "./user.checkSelfAction.guard.ts";
import { CheckModifySelfRoleGuard } from "./user.checkModifySelfRole.guard.ts";
import { partActionsLoginRequiredGuard } from "../auth/user.partActionsLoginRequired.guard.ts";
import { CheckModifySelfDepartmentGuard } from "./user.checkModifySelfDepartment.guard.ts";
// @deno-types="npm:@types/express"
import express from "express";

@Controller("user")
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@Post("/register")
	public async register(@Body() body: InsertUserData) {
		return (await this.userService.insertUser(body))[0];
	}

	@UseGuards(LocalAuthGuard)
	@Post("/login")
	public login(@Request() request: express.Request) {
		return request.user;
	}

	@Get("/logout")
	public logout(@Session() session: any) {
		session.destroy();
		return "Logged out";
	}

	@UseGuards(AuthenticatedGuard)
	@Get("/profile")
	public async getProfile(@Request() request: any) {
		return this.userService.getUserById(request.user.id, true, true);
	}

	@UseGuards(new partActionsLoginRequiredGuard(["borrow", true]))
	@Get("/getUser/:id")
	public async getUser(
		@Param("id") userId: string,
		@Query("borrow", new ParseBoolPipe({ optional: true })) getBorrow?: boolean,
	) {
		const o = await this.userService.getUserById(userId, getBorrow, false);
		if (!o) throw new BadRequestException("找不到指定使用者");
		return o;
	}

	@Get("/getUsers")
	public getUsers() {
		return this.userService.getAllUsers();
	}

	@UseGuards(CheckModifySelfRoleGuard)
	@UseGuards(CheckModifySelfDepartmentGuard)
	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Patch("/updateInfo")
	public async updateUserInfo(@Body() updateUserData: UpdateUserData) {
		return this.userService.updateUserInformation(updateUserData);
	}

	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Patch("/updatePassword")
	public async updatePassword(
		@Request() request: any,
		@Body() updatePasswordData: UpdateUserPasswordData,
	) {
		const adminActions = {
			adminAction: request.user.role === Roles.ADMIN,
			adminId: request.user.id,
		};
		await this.userService.updateUserPassword(updatePasswordData, adminActions);
		return "Password changed successfully.";
	}

	@UseGuards(CheckSelfUserActionGuard)
	@UseGuards(AuthenticatedGuard)
	@Delete("/deleteUser")
	public async DeleteUserData(
		@Request() request: any,
		@Body() deleteUserData: DeleteUserData,
	) {
		const result = await this.userService.deleteUser(
			request.user,
			deleteUserData,
		);
		if (result.logoutAfterSucceed) request.session.destroy();
		return result.message;
	}
}

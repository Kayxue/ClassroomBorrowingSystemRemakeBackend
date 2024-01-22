import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteUserData, GetUserData, InsertUserData, UpdateUserData, UpdateUserPasswordData } from '../Types/RequestBody.dto';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Roles } from '../Types/Types';
import { CheckSelfUserActionGuard } from './user.checkSelfAction.guard';
import { CheckModifySelfRoleGuard } from './user.checkModifySelfRole.guard';

@Controller('user')
export class UserController {
    public constructor(private readonly userService: UserService) { }

    @Post("/register")
    public async register(@Body() body: InsertUserData) {
        return this.userService.insertUser(body);
    }

    @UseGuards(LocalAuthGuard)
    @Post("/login")
    public login(@Request() request) {
        return request.user
    }

    @Get("/logout")
    public logout(@Request() request) {
        request.session.destroy();
        return "Logged out"
    }

    @UseGuards(AuthenticatedGuard)
    @Get("/profile")
    public async getProfile(@Request() request) {
        const o = await this.userService.getUserById(request.user.id, true);
        const { password, ...restUser } = o;
        return restUser;
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/getUser')
    public async getUser(@Body() body: GetUserData) {
        const o = await this.userService.getUserById(body.userId, true);
        const { password, ...restUser } = o;
        return restUser;
    }

    @UseGuards(AuthenticatedGuard)
    @Get("/getUsers")
    public getUsers() {
        return this.userService.getAllUsers();
    }

    @UseGuards(CheckModifySelfRoleGuard)
    @UseGuards(CheckSelfUserActionGuard)
    @UseGuards(AuthenticatedGuard)
    @Patch("/updateInfo")
    public async updateUserInfo(@Request() request, @Body() updateUserData: UpdateUserData) {
        const { password, ...restData } = await this.userService.updateUserInformation(updateUserData);
        return restData;
    }

    @UseGuards(CheckSelfUserActionGuard)
    @UseGuards(AuthenticatedGuard)
    @Patch("/updatePassword")
    public async updatePassword(@Request() request, @Body() updatePasswordData: UpdateUserPasswordData) {
        const adminActions = { adminAction: request.user.role === Roles.ADMIN, adminId: request.user.id }
        await this.userService.updateUserPassword(updatePasswordData, adminActions)
        return "Password changed successfully."
    }

    @UseGuards(CheckSelfUserActionGuard)
    @UseGuards(AuthenticatedGuard)
    @Delete("/deleteUser")
    public async DeleteUserData(@Request() request, @Body() deleteUserData: DeleteUserData) {
        const result = await this.userService.deleteUser(request.user, deleteUserData);
        if (result.logoutAfterSucceed) request.session.destroy();
        return result.message
    }
}

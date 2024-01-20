import { BadRequestException, Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { DeleteUserData, InsertUserData, UpdateUserPasswordData } from '../Types/RequestBody.dto';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { Roles } from '../Types/Types';

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
    public getProfile(@Request() request) {
        return request.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Patch("/updatePassword")
    public async updatePassword(@Request() request, @Body() updatePasswordData: UpdateUserPasswordData) {
        if (request.user.id !== updatePasswordData.userId && request.user.role !== Roles.ADMIN) throw new BadRequestException("您無法變更別人的密碼")
        const returned = await this.userService.updateUserPassword(updatePasswordData, { adminAction: request.user.role === Roles.ADMIN, adminId: request.user.id })
        return "Password changed successfully."
    }

    @UseGuards(AuthenticatedGuard)
    @Delete("/deleteUser")
    public async DeleteUserData(@Request() request, @Body() deleteUserData: DeleteUserData) {
        const result = await this.userService.deleteUser(request.user, deleteUserData);
        if (result.logoutAfterSucceed) request.session.destroy();
        return result.message
    }
}

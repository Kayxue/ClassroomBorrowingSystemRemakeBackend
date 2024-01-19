import { BadRequestException, Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { InsertUserData, UpdateUserPasswordData } from '../Types/RequestBody.dto';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

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
        if (request.user.id !== updatePasswordData.userId) throw new BadRequestException("您無法變更別人的密碼")
        const returned = await this.userService.updateUserPassword(updatePasswordData)
        request.session.destroy();
        return "Password changed successfully, you have been logged out."
    }
}

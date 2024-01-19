import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DeleteUserData, InsertUserData, UpdateUserPasswordData } from '../Types/RequestBody.dto';
import * as bcrypt from "bcrypt"
import { salt } from '../Config';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Injectable()
export class UserService {
    public constructor(private prismaService: PrismaService) { }

    public async insertUser(insertUserObj: InsertUserData) {
        const hashedPassword = await bcrypt.hash(insertUserObj.password, salt)
        return this.prismaService.user.create({
            data: {
                ...insertUserObj,
                password: hashedPassword
            }
        }).catch(_ => { throw new BadRequestException("該使用者名稱已被使用") })
    }

    public async getUser(username: string) {
        return this.prismaService.user.findUnique({ where: { username: username } })
    }

    public async updateUserPassword({ userId, oldPassword, newPassword, confirmPassword }: UpdateUserPasswordData) {
        if (newPassword != confirmPassword) {
            throw new BadRequestException("新密碼與確認密碼不一致");
        }
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        // if (!user) throw new BadRequestException("找不到使用者")
        const oldPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!oldPasswordMatch) throw new BadRequestException("舊密碼錯誤");
        if (oldPassword === newPassword) throw new BadRequestException("新舊密碼一致")
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        return this.prismaService.user.update({
            where: { id: userId },
            data: {
                password: newHashedPassword
            }
        })
    }

    public async deleteUser(requestUser: any, { userId }: DeleteUserData) {
        if (requestUser.id !== userId && requestUser.role !== Roles.ADMIN) throw new ForbiddenException("非管理員無法刪除其他帳戶")
        const actionResult = { logoutAfterSucceed: false, message: "Account Deleted Successful" };
        if (requestUser.id == userId) {
            actionResult.logoutAfterSucceed = true;
            actionResult.message = "You have deleted your account, you have been logged out"
        }
        const user = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!user) throw new BadRequestException("找不到使用者")
        await this.prismaService.user.delete({ where: { id: userId } });
        return actionResult
    }
}

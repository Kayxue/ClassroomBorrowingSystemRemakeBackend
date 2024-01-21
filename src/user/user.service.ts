import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DeleteUserData, InsertUserData, UpdateUserData, UpdateUserPasswordData } from '../Types/RequestBody.dto';
import * as bcrypt from "bcrypt"
import { salt } from '../Config';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { IAdminActionData, Roles } from '../Types/Types';

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

    public async getAllUsers() {
        return (await this.prismaService.user.findMany()).map(e => {
            const { password, ...rest } = e
            return rest;
        });
    }

    public async updateUserInformation(updateUserData: UpdateUserData) {
        const { userId, ...restUpdatedUserData } = updateUserData
        return this.prismaService.user.update({
            where: { id: userId },
            data: {
                ...restUpdatedUserData
            }
        })
    }

    public async updateUserPassword({ userId, oldPassword, newPassword, confirmPassword }: UpdateUserPasswordData, { adminAction, adminId }: IAdminActionData) {
        if (!adminAction) {
            if (newPassword != confirmPassword) {
                throw new BadRequestException("新密碼與確認密碼不一致");
            }
            const user = await this.prismaService.user.findUnique({ where: { id: userId } })
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
        } else {
            const admin = await this.prismaService.user.findUnique({ where: { id: adminId } });
            const adminPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);
            if (!adminPasswordCorrect) throw new BadRequestException("管理員密碼錯誤")
            const newHashedPassword = await bcrypt.hash(newPassword, salt);
            return this.prismaService.user.update({
                where: { id: userId },
                data: {
                    password: newHashedPassword
                }
            })
        }
    }

    public async deleteUser(requestUser: any, { userId }: DeleteUserData) {
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

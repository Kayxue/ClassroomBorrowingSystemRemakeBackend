import { BadRequestException, Injectable } from '@nestjs/common';
import { InsertUserData, UpdateUserPasswordData } from '../Types/RequestBody.dto';
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
        if (!user) throw new BadRequestException("找不到使用者")
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
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InsertUserData } from '../Types/RequestBody.dto';
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
}

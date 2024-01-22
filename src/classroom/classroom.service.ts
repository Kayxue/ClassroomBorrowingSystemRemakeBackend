import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { DeleteClassroomData, InsertClassroomData, UpdateClassroomData } from 'src/Types/RequestBody.dto';

@Injectable()
export class ClassroomService {
    public constructor(private prismaService: PrismaService) { }

    public async insertClassroom(classroomData: InsertClassroomData) {
        const now = new Date();
        return this.prismaService.classroomData.create({
            data: {
                ...classroomData,
                addedTime: now,
                updatedTime: now
            }
        }).catch(_ => { throw new BadRequestException("此教室已新增") })
    }

    public async getClassroom(id: string, borrows?: boolean) {
        return this.prismaService.classroomData.findUnique({ where: { id }, include: { borrowingDatas: borrows ?? false } });
    }

    public async getClassrooms(borrows?: boolean) {
        return this.prismaService.classroomData.findMany({ include: { borrowingDatas: borrows ?? false } })
    }

    public async updateClassroomData(classroomData: UpdateClassroomData) {
        const { classroomId, ...restClassroomData } = classroomData
        const updateTime = new Date()
        const result = this.prismaService.classroomData.findUnique({ where: { id: classroomId } })
        if (!result) throw new BadRequestException("找不到指定教室")
        return this.prismaService.classroomData.update({ where: { id: classroomId }, data: { ...restClassroomData, updatedTime: updateTime } });
    }

    public async deleteClassroomData(classroomData: DeleteClassroomData) {
        const result = this.prismaService.classroomData.findUnique({ where: { id: classroomData.classroomId } });
        if (!result) throw new BadRequestException("找不到指定教室")
        await this.prismaService.classroomData.delete({ where: { id: classroomData.classroomId } });
        return "成功刪除"
    }
}

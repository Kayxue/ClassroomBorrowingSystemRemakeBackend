import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { InsertClassroomData } from 'src/Types/RequestBody.dto';

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
        })
    }

    public async getClassroom(id: string, borrows?: boolean) {
        return this.prismaService.classroomData.findUnique({ where: { id }, include: { borrowingDatas: borrows ?? false } });
    }

    public async getClassrooms(borrows?: boolean) {
        return this.prismaService.classroomData.findMany({ include: { borrowingDatas: borrows ?? false } })
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';

@Injectable()
export class ClassroomService {
    public constructor(private prismaService: PrismaService) { }

    public async getClassroom(id?: string, borrows?: boolean) {
        if (id) return this.prismaService.classroomData.findUnique({ where: { id }, include: { borrowingDatas: borrows ?? false } });
        return this.prismaService.classroomData.findMany({ include: { borrowingDatas: borrows ?? false } })
    }
}

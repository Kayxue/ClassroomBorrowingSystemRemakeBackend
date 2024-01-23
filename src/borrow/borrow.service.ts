import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service';
import { InsertBorrowData } from 'src/Types/RequestBody.dto';

@Injectable()
export class BorrowService {
    public constructor(private prismaClient: PrismaService) { }

    public async insertBorrow(borrowData: InsertBorrowData) {
        const { startTime, endTime, from, to, classroomId } = borrowData
        const allBorrowOfClassroom = await this.prismaClient.borrowingData.findMany({
            where: {
                classroomId
            }
        })
        const result = allBorrowOfClassroom.filter(e => {

        })
    }


}

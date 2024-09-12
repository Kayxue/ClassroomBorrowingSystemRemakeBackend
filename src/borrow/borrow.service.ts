import { Inject, Injectable } from '@nestjs/common';
import * as schema from '../drizzle/schema';
import { InsertBorrowData } from 'src/Types/RequestBody.dto';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';

@Injectable()
export class BorrowService {
    public constructor(@Inject('drizzledb') private drizzledb: LibSQLDatabase<typeof schema>) { }

    public async insertBorrow(borrowData: InsertBorrowData) {
        const { startTime, endTime, from, to, classroomId } = borrowData
        const allBorrowOfClassroom=await this.drizzledb.query.borrowing.findMany({where:eq(schema.borrowing.classroomId,classroomId)})
        const result = allBorrowOfClassroom.filter(e => {

        })
    }


}

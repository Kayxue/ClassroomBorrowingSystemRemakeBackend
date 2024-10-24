import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as schema from "../drizzle/schema.ts";
import { DeleteBorrowData, InsertBorrowData } from "../Types/RequestBody.dto.ts";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

@Injectable()
export class BorrowService {
    public constructor(
        @Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
    ) {}

    public async insertBorrow(borrowData: InsertBorrowData) {
		//Fuck!!!!!!!!!!!!!!!!
		const { userId, startTime, endTime, from, to, classroomId } = borrowData;
		const startTimeMs = startTime.getTime();
    	const endTimeMs = endTime.getTime();

		if (startTimeMs > endTimeMs || from > to)
		{
			throw new BadRequestException('Error Input');
		}

		const allBorrowOfClassroom = await this.drizzledb.query.borrowing.findMany({
			where: eq(schema.borrowing.classroomId, classroomId),
		});

		const overlappingBorrows = allBorrowOfClassroom.filter((e) => {
			if (e.startTime !== null && e.endTime !== null) {
				const existingStartTimeMs = new Date(e.startTime).getTime();
            	const existingEndTimeMs = new Date(e.endTime).getTime();
				const timeOverlap = startTimeMs < existingEndTimeMs && endTimeMs > existingStartTimeMs;
				const periodOverlap = (to >= e.from && from <= e.to);

				if (startTimeMs == existingEndTimeMs || endTimeMs == existingStartTimeMs ||
				startTimeMs == existingStartTimeMs || endTimeMs == existingEndTimeMs)
				{
					if (periodOverlap)
					{
						return true;
					}
				}

				if (timeOverlap && periodOverlap) 
				{
					return true;
				}
			}
			return false;
		});

		if (overlappingBorrows.length > 0) {
			throw new BadRequestException('The classroom is already booked for the given time period and course section.');
		}

		return this.drizzledb
			.insert(schema.borrowing)
			.values({ ...borrowData })
			.catch((_) => {
				throw new BadRequestException("BUG");
			});
	}

	public async deleteBorrowData(borrowData: DeleteBorrowData) {
		//Fuck!!!!!!!!!!!!!!!!
		
		const result = this.drizzledb.query.borrowing.findFirst({
			where: eq(schema.borrowing.id, borrowData.borrowId),
		});
		if (!result) throw new BadRequestException("找不到指定借用紀錄");
		await this.drizzledb
			.delete(schema.borrowing)
			.where(eq(schema.borrowing.id, borrowData.borrowId));
		return "成功刪除";
	}

    // TODO: Update Borrow Record
    // TODO: Retrieve borrowing records of today
}

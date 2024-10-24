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
		const allBorrowOfClassroom = await this.drizzledb.query.borrowing.findMany({
			where: eq(schema.borrowing.classroomId, classroomId),
		});

		const overlappingBorrows = allBorrowOfClassroom.filter((e) => {
			if (e.startTime !== null && e.endTime !== null) {
				const existingStartTime = new Date(e.startTime);
				const existingEndTime = new Date(e.endTime);
				const timeOverlap = startTime.getTime() < existingEndTime.getTime() && endTime.getTime() > existingStartTime.getTime();
				const periodOverlap = (to >= e.from && from <= e.to);

				if (startTime.getTime() > endTime.getTime() || endTime.getTime() > startTime.getTime())
				{
					return true;
				}

				if (startTime.getTime() == existingEndTime.getTime() || endTime.getTime() == existingStartTime.getTime() ||
					startTime.getTime() == existingStartTime.getTime() || endTime.getTime() == existingEndTime.getTime())
				{
					if (periodOverlap)
						return true;
				}

				if (timeOverlap && periodOverlap) {
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

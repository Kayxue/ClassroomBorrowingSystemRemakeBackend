import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as schema from "../drizzle/schema.ts";
import { InsertBorrowData } from "../Types/RequestBody.dto.ts";
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
	
		return await this.drizzledb
			.insert(schema.borrowing)
			.values({ ...borrowData })
			.catch((_) => {
				throw new BadRequestException("BUG");
			});
	}	

    // TODO: Update Borrow Record
    // TODO: Delete Borrow Record
    // TODO: Retrieve borrowing records of today
}

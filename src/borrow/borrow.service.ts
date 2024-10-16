import { Inject, Injectable } from "@nestjs/common";
import * as schema from "../drizzle/schema.ts";
import { InsertBorrowData } from "../Types/RequestBody.dto.ts";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

@Injectable()
export class BorrowService {
	public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

	//TODO: Insert Borrow Record
	public async insertBorrow(borrowData: InsertBorrowData) {
		const { startTime, endTime, from, to, classroomId } = borrowData;
		const allBorrowOfClassroom = await this.drizzledb.query.borrowing.findMany({
			where: eq(schema.borrowing.classroomId, classroomId),
		});
		const result = allBorrowOfClassroom.filter((e) => {});
	}

	//TODO: Update Borrow Record
	//TODO: Delete Borrow Record
	//TODO: Retrive borrowing records of today
}

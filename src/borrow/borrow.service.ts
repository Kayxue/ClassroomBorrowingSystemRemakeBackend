import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import moment from "moment-timezone";
import * as schema from "../drizzle/schema.ts";
import {
	DeleteBorrowData,
	InsertBorrowData,
} from "../Types/RequestBody.dto.ts";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { and, eq, gte, lte, or, sql } from "drizzle-orm";

@Injectable()
export class BorrowService {
	public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

	public async insertBorrow(borrowData: InsertBorrowData) {
		try {
			// 解構借用數據
			const { userId, startTime, endTime, from, to, classroomId } = borrowData;
			const startTimeMoment = moment(startTime);
			let endTimeMoment = moment(endTime);

			// 驗證輸入的時間順序
			if (startTimeMoment.diff(endTimeMoment) > 0 || from > to) {
				return {
					success: false,
					message: "時間輸入錯誤，開始時間應早於結束時間",
					data: null,
				};
			}

			//End Time Correction
			while (startTimeMoment.day() !== endTimeMoment.day()) {
				endTimeMoment = endTimeMoment.add(-1, "d");
			}

			const firstLevelFilter = this.drizzledb
				.select()
				.from(schema.borrowing)
				.where(eq(schema.borrowing.classroomId, classroomId))
				.as("firstLevelFilter");
			const secondLevelFilter = this.drizzledb
				.select()
				.from(firstLevelFilter)
				.where(
					sql`weekday(${schema.borrowing.startTime}) = ${(startTimeMoment.day() + 6) % 7}`,
				)
				.as("secondLevelFilter");
			const thirdLevelFilter = this.drizzledb
				.select()
				.from(secondLevelFilter)
				.where(
					or(
						and(
							lte(schema.borrowing.startTime, startTimeMoment.toDate()),
							gte(schema.borrowing.endTime, startTimeMoment.toDate()),
						),
						and(
							lte(schema.borrowing.startTime, endTimeMoment.toDate()),
							gte(schema.borrowing.endTime, endTimeMoment.toDate()),
						),
					),
				)
				.as("thirdLevelFilter");
			const finalResult = await this.drizzledb
				.select()
				.from(thirdLevelFilter)
				.where(
					or(
						and(
							lte(schema.borrowing.from, from),
							gte(schema.borrowing.to, from),
						),
						and(lte(schema.borrowing.from, to), gte(schema.borrowing.to, to)),
					),
				);

			// 如果有重疊的記錄，拋出異常
			if (finalResult.length > 0) {
				return {
					success: false,
					message: "此時間段和課節已被預訂",
					data: null,
				};
			}

			const toInsert = {
				...borrowData,
				endTime: endTimeMoment.toDate(),
			};

			// 插入新的借用記錄
			await this.drizzledb.insert(schema.borrowing).values({ ...toInsert });
			return {
				success: true,
				message: "借用記錄成功插入",
				data: null,
			};
		} catch (error) {
			// 捕獲異常並返回具體錯誤訊息
			if (error instanceof BadRequestException) {
				throw error;
			} else {
				throw new BadRequestException("無法插入借用記錄，請稍後再試");
			}
		}
	}

	public async deleteBorrowData(borrowData: DeleteBorrowData) {
		try {
			// 查找要刪除的借用記錄
			const result = await this.drizzledb.query.borrowing.findFirst({
				where: eq(schema.borrowing.id, borrowData.borrowId),
			});

			// 如果找不到記錄，拋出異常
			if (!result) {
				throw new BadRequestException("找不到指定的借用記錄");
			}

			// 刪除借用記錄
			await this.drizzledb
				.delete(schema.borrowing)
				.where(eq(schema.borrowing.id, borrowData.borrowId));
			return {
				message: "成功刪除借用記錄",
			};
		} catch (error) {
			// 捕獲異常並返回具體錯誤訊息
			if (error instanceof BadRequestException) {
				throw error;
			} else {
				throw new BadRequestException("刪除借用記錄時發生錯誤，請稍後再試");
			}
		}
	}

	public async getTodaysBorrow() {
		const data = await this.drizzledb
			.select()
			.from(schema.user)
			.innerJoin(schema.borrowing, eq(schema.user.id, schema.borrowing.userId))
			.innerJoin(
				schema.classroom,
				eq(schema.borrowing.classroomId, schema.classroom.id),
			)
			.where(sql`${schema.borrowing.startTime} = date(${new Date()})`);
		return data;
	}
}

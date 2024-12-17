import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as schema from "../drizzle/schema.ts";
import {
	DeleteBorrowData,
	InsertBorrowData,
} from "../Types/RequestBody.dto.ts";
import { type MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";

@Injectable()
export class BorrowService {
	public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

	public async insertBorrow(borrowData: InsertBorrowData) {
		try {
			// 解構借用數據
			const { startTime, endTime, from, to, classroomId } = borrowData;
			const startTimeMs = startTime.getTime();
			const endTimeMs = endTime.getTime();

			// 獲取當天 00:00:00 的時間戳 (毫秒)
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const todayMs = today.getTime();

			// 驗證輸入的時間是否合法
			if (startTimeMs < todayMs || endTimeMs < todayMs) {
				return {
					success: false,
					message: "時間輸入錯誤，不能早於當前時間",
					data: { startTimeMs, endTimeMs, today: todayMs },
				};
			}

			// 驗證輸入的時間順序
			if (startTimeMs > endTimeMs || from > to) {
				return {
					success: false,
					message: "時間輸入錯誤，開始時間應早於結束時間",
				};
			}

			// 驗證是否在當天的時間範圍內
			const startTimeMsToday = new Date(startTimeMs).setHours(0, 0, 0, 0);
			const endTimeMsToday = new Date(endTimeMs).setHours(0, 0, 0, 0);

			if (startTimeMsToday == todayMs || endTimeMsToday == todayMs) {
				// Define time slots
				const timeSlots = [
					{ id: 1, start: "08:20", end: "09:10" },
					{ id: 2, start: "09:20", end: "10:10" },
					{ id: 3, start: "10:20", end: "11:10" },
					{ id: 4, start: "11:15", end: "12:05" },
					{ id: 5, start: "12:10", end: "13:00" },
					{ id: 6, start: "13:10", end: "14:00" },
					{ id: 7, start: "14:10", end: "15:00" },
					{ id: 8, start: "15:10", end: "16:00" },
				];

				// Get the current time
				const now = new Date();
				const nowHours = now.getHours();
				const nowMinutes = now.getMinutes();
				const currentTime = nowHours * 60 + nowMinutes; // Current time in minutes

				// Convert 'from' and 'to' to minutes
				const fromTime = timeSlots[from - 1];
				const toTime = timeSlots[to - 1];

				// Check if the current time exceeds the "from"
				const fromStartMinutes =
					parseInt(fromTime.start.split(":")[0]) * 60 +
					parseInt(fromTime.start.split(":")[1]);

				if (currentTime >= fromStartMinutes) {
					return {
						success: false,
						message: `當前時間 ${nowHours}:${nowMinutes} 已經過了選定的時段 (${fromTime.start} 到 ${toTime.end})，請選擇其他時間`,
					};
				}
			}

			// 查找教室的所有借用記錄
			const allBorrowOfClassroom =
				await this.drizzledb.query.borrowing.findMany({
					where: eq(schema.borrowing.classroomId, classroomId),
				});

			// 檢查是否有重疊的借用記錄
			const overlappingBorrows = allBorrowOfClassroom.filter((e) => {
				if (e.startTime !== null && e.endTime !== null) {
					const existingStartTimeMs = new Date(e.startTime).getTime();
					const existingEndTimeMs = new Date(e.endTime).getTime();
					const timeOverlap =
						startTimeMs < existingEndTimeMs && endTimeMs > existingStartTimeMs;
					const periodOverlap = to >= e.from && from <= e.to;

					// 檢查是否有時間和節數重疊
					if (
						(startTimeMs === existingEndTimeMs ||
							endTimeMs === existingStartTimeMs ||
							startTimeMs === existingStartTimeMs ||
							endTimeMs === existingEndTimeMs) &&
						periodOverlap
					) {
						return true;
					}

					if (timeOverlap && periodOverlap) {
						return true;
					}
				}
				return false;
			});

			// 如果有重疊的記錄，拋出異常
			if (overlappingBorrows.length > 0) {
				return {
					success: false,
					message: "此時間段和課節已被預訂",
				};
			}

			// 插入新的借用記錄
			await this.drizzledb.insert(schema.borrowing).values({ ...borrowData });
			return {
				success: true,
				message: "借用記錄成功插入",
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
				return {
					message: "找不到指定的借用記錄",
				};
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

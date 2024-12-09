import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as schema from "../drizzle/schema.ts";
import { DeleteBorrowData, InsertBorrowData } from "../Types/RequestBody.dto.ts";
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
            const { userId, startTime, endTime, from, to, classroomId } = borrowData;
            const startTimeMs = startTime.getTime();
            const endTimeMs = endTime.getTime();

            // 驗證輸入的時間順序
            if (startTimeMs > endTimeMs || from > to) {
                return {
                    success: false,
                    message: '時間輸入錯誤，開始時間應早於結束時間',
                    data: null,
                };
            }

            // 查找教室的所有借用記錄
            const allBorrowOfClassroom = await this.drizzledb.query.borrowing.findMany({
                where: eq(schema.borrowing.classroomId, classroomId),
            });

            // 檢查是否有重疊的借用記錄
            const overlappingBorrows = allBorrowOfClassroom.filter((e) => {
                if (e.startTime !== null && e.endTime !== null) {
                    const existingStartTimeMs = new Date(e.startTime).getTime();
                    const existingEndTimeMs = new Date(e.endTime).getTime();
                    const timeOverlap = startTimeMs < existingEndTimeMs && endTimeMs > existingStartTimeMs;
                    const periodOverlap = (to >= e.from && from <= e.to);

                    // 檢查是否有時間和節數重疊
                    if ((startTimeMs === existingEndTimeMs || endTimeMs === existingStartTimeMs ||
                        startTimeMs === existingStartTimeMs || endTimeMs === existingEndTimeMs) && periodOverlap) {
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
                    message: '此時間段和課節已被預訂',
                    data: null,
                };
            }

            // 插入新的借用記錄
            await this.drizzledb.insert(schema.borrowing).values({ ...borrowData });
            return {
                success: true,
                message: '借用記錄成功插入',
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
            await this.drizzledb.delete(schema.borrowing).where(eq(schema.borrowing.id, borrowData.borrowId));
            return {
                message: '成功刪除借用記錄',
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


    // TODO: Retrieve borrowing records of today
    public async getTodaysBorrow(){
        const data=await this.drizzledb.select().from(schema.user).innerJoin(schema.borrowing,eq(schema.user.id,schema.borrowing.userId)).where(sql`WEEKDAYS(${schema.borrowing.startTime}) = ${((new Date()).getDay()+6)%7}`)
        return data
    }
}

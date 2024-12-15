import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as schema from "../drizzle/schema.ts";
import { type MySql2Database } from "drizzle-orm/mysql2";
import {
	DeleteClassroomData,
	InsertClassroomData,
	UpdateClassroomData,
} from "../Types/RequestBody.dto.ts";
import { eq, sql, and } from "drizzle-orm";

@Injectable()
export class ClassroomService {
	public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

	public async insertClassroom(classroomData: InsertClassroomData) {
		const now = new Date();
		return this.drizzledb
			.insert(schema.classroom)
			.values({ ...classroomData, addedTime: now, updatedTime: now })
			.catch((_) => {
				throw new BadRequestException("此教室已新增");
			});
	}

	public async getClassroom(id: string, borrows?: boolean, isToday?: boolean) {
		const todayCondition = isToday
			? sql`${schema.borrowing.startTime} = date(${new Date()})`
			: undefined;

		return this.drizzledb.query.classroom.findFirst({
			where: eq(schema.classroom.id, id),
			with: {
				borrowingDatas: borrows
					? {
							where: todayCondition,
							with: {
								user: {
									columns: {
										username: true,
									},
								},
							},
						}
					: undefined,
			},
		});
	}

	public async getClassrooms(borrows?: boolean) {
		return this.drizzledb.query.classroom.findMany({
			with: {
				borrowingDatas: borrows
					? {
							with: {
								user: {
									columns: {
										username: true,
									},
								},
							},
						}
					: undefined,
			},
		});
	}

	public async updateClassroomData(classroomData: UpdateClassroomData) {
		const { classroomId, ...restClassroomData } = classroomData;
		const updateTime = new Date();
		const result = this.drizzledb.query.classroom.findFirst({
			where: eq(schema.classroom.id, classroomId),
		});
		if (!result) throw new BadRequestException("找不到指定教室");
		return this.drizzledb
			.update(schema.classroom)
			.set({ ...restClassroomData, updatedTime: updateTime })
			.where(eq(schema.classroom.id, classroomId));
	}

	public async deleteClassroomData(classroomData: DeleteClassroomData) {
		const result = this.drizzledb.query.classroom.findFirst({
			where: eq(schema.classroom.id, classroomData.classroomId),
		});
		if (!result) throw new BadRequestException("找不到指定教室");
		await this.drizzledb
			.delete(schema.classroom)
			.where(eq(schema.classroom.id, classroomData.classroomId));
		return "成功刪除";
	}
}

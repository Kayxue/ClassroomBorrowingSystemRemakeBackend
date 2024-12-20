import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { MySql2Database } from "drizzle-orm/mysql2";
import { count, eq } from "drizzle-orm";
import * as schema from "../drizzle/schema.ts";
import type {
	DeleteDepartmentData,
	InsertDepartmentData,
	UpdateDepartmentData,
} from "../Types/RequestBody.dto.ts";

@Injectable()
export class DepartmentService {
	public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

	public async getAllDepartments() {
		const departments = await this.drizzledb.query.department.findMany();
		const departmentWithUserCount = await Promise.all(
			departments.map(async (department) => {
				const userCountObj = await this.drizzledb
					.select({ count: count() })
					.from(schema.user)
					.where(eq(schema.user.departmentId, department.id as string));
				const userCount = userCountObj[0].count;
				return { ...department, userCount };
			}),
		);
		const departmentCount = await this.drizzledb
			.select({ count: count() })
			.from(schema.department);
		return { count: departmentCount[0].count, departmentWithUserCount };
	}

	public async getDepartment(departmentID: string, retrieveMember: boolean) {
		const department = await this.drizzledb.query.department.findFirst({
			where: eq(schema.department.id, departmentID),
			with: { members: retrieveMember || undefined },
		});
		if (!department)
			throw new BadRequestException("Can't find specific department data");
		return department;
	}

	public insertDepartment(data: InsertDepartmentData) {
		return this.drizzledb
			.insert(schema.department)
			.values({ ...data })
			.catch((_) => {
				throw new BadRequestException("此部門已經新增");
			});
	}

	public async deleteDepartment(data: DeleteDepartmentData) {
		const department = await this.drizzledb.query.department.findFirst({
			where: eq(schema.department.id, data.departmentId),
		});
		if (!department) throw new BadRequestException("找不到部門");
		await this.drizzledb
			.delete(schema.department)
			.where(eq(schema.department.id, department.id));
		return "Department deleted";
	}

	public async updateDepartment(data: UpdateDepartmentData) {
		const department = await this.drizzledb.query.department.findFirst({
			where: eq(schema.department.id, data.departmentId),
		});
		if (!department) throw new BadRequestException("找不到部門");

		await this.drizzledb
			.update(schema.department)
			.set({ ...data })
			.where(eq(schema.department.id, data.departmentId));
		return "Department updated";
	}
}

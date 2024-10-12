import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.ts";
import type { InsertDepartmentData } from "../Types/RequestBody.dto.ts";

@Injectable()
export class DepartmentService {
    public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

    public async insertDepartment(data:InsertDepartmentData){
        return this.drizzledb.insert(schema.department).values({...data}).catch(_=>{throw new BadRequestException("此部門已經新增")});
    }
}

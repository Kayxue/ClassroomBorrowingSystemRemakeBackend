import { Inject, Injectable } from '@nestjs/common';
import type { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.ts";

@Injectable()
export class DepartmentService {
    public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}
}

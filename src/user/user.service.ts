import {
	BadRequestException,
	Inject,
	Injectable,
} from "@nestjs/common";
import {
	DeleteUserData,
	InsertUserData,
	UpdateUserData,
	UpdateUserPasswordData,
} from "../Types/RequestBody.dto.ts";
import * as argon2 from "argon2";
import {
	passwordParallelism,
	passwordSecret,
	saltTimeCount,
} from "../Config.ts";
import { IAdminActionData, Roles } from "../Types/Types.ts";
import { type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

@Injectable()
export class UserService {
	public constructor(
		@Inject("drizzledb") private drizzledb: MySql2Database<typeof schema>,
	) {}

	public async insertUser(insertUserObj: InsertUserData) {
		const hashedPassword = await argon2.hash(insertUserObj.password, {
			timeCost: saltTimeCount,
			secret: passwordSecret,
			parallelism: passwordParallelism,
		});
		return this.drizzledb
			.insert(schema.user)
			.values({ ...insertUserObj, password: hashedPassword })
			.catch((_) => {
				throw new BadRequestException("該使用者名稱已被使用");
			});
	}

	public async getUser(username: string, withBorrowData: boolean) {
		return this.drizzledb.query.user.findFirst({
			where: eq(schema.user.username, username),
			with: { borrows: withBorrowData || undefined },
		});
	}

	public async getUserById(id: string, withBorrowData: boolean | undefined) {
		return this.drizzledb.query.user.findFirst({
			where: eq(schema.user.id, id),
			with: { borrows: withBorrowData || undefined },
			columns: { password: false },
		});
	}

	public async getAllUsers() {
		return await this.drizzledb.query.user.findMany({
			columns: { password: false },
		});
	}

	public async updateUserInformation(updateUserData: UpdateUserData) {
		const { userId, ...restUpdatedUserData } = updateUserData;
		return this.drizzledb
			.update(schema.user)
			.set({ ...restUpdatedUserData })
			.where(eq(schema.user.id, userId));
	}

	public async updateUserPassword(
		{
			userId,
			oldPassword,
			newPassword,
			confirmPassword,
		}: UpdateUserPasswordData,
		{ adminAction, adminId }: IAdminActionData,
	) {
		if (userId == adminId || !adminAction) {
			if (newPassword != confirmPassword) {
				throw new BadRequestException("新密碼與確認密碼不一致");
			}
			const user = await this.drizzledb.query.user.findFirst({
				where: eq(schema.user.id, userId),
			});
			const oldPasswordMatch = await argon2.verify(
				user!.password,
				oldPassword,
				{
					secret: passwordSecret,
				},
			);
			if (!oldPasswordMatch) throw new BadRequestException("舊密碼錯誤");
			if (oldPassword === newPassword)
				throw new BadRequestException("新舊密碼一致");
			const newHashedPassword = await argon2.hash(newPassword, {
				timeCost: saltTimeCount,
				secret: passwordSecret,
				parallelism: passwordParallelism,
			});
			return this.drizzledb
				.update(schema.user)
				.set({ password: newHashedPassword })
				.where(eq(schema.user.id, userId));
		} else {
			const admin = await this.drizzledb.query.user.findFirst({
				where: eq(schema.user.id, adminId),
			});
			const adminPasswordCorrect = await argon2.verify(
				admin!.password,
				oldPassword,
				{ secret: passwordSecret },
			);
			if (!adminPasswordCorrect)
				throw new BadRequestException("管理員密碼錯誤");
			const newHashedPassword = await argon2.hash(newPassword, {
				timeCost: saltTimeCount,
				secret: passwordSecret,
				parallelism: passwordParallelism,
			});
			return this.drizzledb
				.update(schema.user)
				.set({ password: newHashedPassword })
				.where(eq(schema.user.id, userId));
		}
	}

	public async deleteUser(requestUser: any, { userId }: DeleteUserData) {
		const actionResult = {
			logoutAfterSucceed: false,
			message: "Account Deleted Successful",
		};
		if (requestUser.id == userId) {
			actionResult.logoutAfterSucceed = true;
			actionResult.message =
				"You have deleted your account, you have been logged out";
		}
		const user = await this.drizzledb.query.user.findFirst({
			where: eq(schema.user.id, userId),
		});
		if (!user) throw new BadRequestException("找不到使用者");
		await this.drizzledb.delete(schema.user).where(eq(schema.user.id, userId));
		return actionResult;
	}
}

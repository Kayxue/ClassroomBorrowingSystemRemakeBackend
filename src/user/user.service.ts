import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  DeleteUserData,
  InsertUserData,
  UpdateUserData,
  UpdateUserPasswordData,
} from '../Types/RequestBody.dto';
import * as bcrypt from 'bcrypt';
import { salt } from '../Config';
import { IAdminActionData, Roles } from '../Types/Types';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserService {
  public constructor(
    @Inject('drizzledb') private drizzledb: LibSQLDatabase<typeof schema>,
  ) {}

  public async insertUser(insertUserObj: InsertUserData) {
    const hashedPassword = await bcrypt.hash(insertUserObj.password, salt);
    return this.drizzledb
      .insert(schema.user)
      .values({ ...insertUserObj, password: hashedPassword })
      .returning()
      .catch((_) => {
        throw new BadRequestException('該使用者名稱已被使用');
      });
  }

  public async getUser(username: string, withBorrowData: boolean) {
    return this.drizzledb.query.user.findFirst({
      where: eq(schema.user.username, username),
      with: { borrows: withBorrowData || undefined },
    });
  }

  public async getUserById(id: string, withBorrowData: boolean) {
    return this.drizzledb.query.user.findFirst({
      where: eq(schema.user.id, id),
      with: { borrows: withBorrowData || undefined },
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
      .where(eq(schema.user.id, userId))
      .returning();
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
    if (!adminAction) {
      if (newPassword != confirmPassword) {
        throw new BadRequestException('新密碼與確認密碼不一致');
      }
      const user = await this.drizzledb.query.user.findFirst({
        where: eq(schema.user.id, userId),
      });
      const oldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!oldPasswordMatch) throw new BadRequestException('舊密碼錯誤');
      if (oldPassword === newPassword)
        throw new BadRequestException('新舊密碼一致');
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
      return this.drizzledb
        .update(schema.user)
        .set({ password: newHashedPassword })
        .where(eq(schema.user.id, userId));
    } else {
      const admin = await this.drizzledb.query.user.findFirst({
        where: eq(schema.user.id, adminId),
      });
      const adminPasswordCorrect = await bcrypt.compare(
        oldPassword,
        admin.password,
      );
      if (!adminPasswordCorrect)
        throw new BadRequestException('管理員密碼錯誤');
      const newHashedPassword = await bcrypt.hash(newPassword, salt);
      return this.drizzledb
        .update(schema.user)
        .set({ password: newHashedPassword })
        .where(eq(schema.user.id, userId));
    }
  }

  public async deleteUser(requestUser: any, { userId }: DeleteUserData) {
    const actionResult = {
      logoutAfterSucceed: false,
      message: 'Account Deleted Successful',
    };
    if (requestUser.id == userId) {
      actionResult.logoutAfterSucceed = true;
      actionResult.message =
        'You have deleted your account, you have been logged out';
    }
    const user = await this.drizzledb.query.user.findFirst({
      where: eq(schema.user.id, userId),
    });
    if (!user) throw new BadRequestException('找不到使用者');
    await this.drizzledb.delete(schema.user).where(eq(schema.user.id, userId));
    return actionResult;
  }
}

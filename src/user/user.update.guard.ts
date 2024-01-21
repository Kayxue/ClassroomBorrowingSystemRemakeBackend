import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Roles } from "../Types/Types";

@Injectable()
export class UserUpdateGuard implements CanActivate {
    public canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        if (request.user.id !== request.body.userId && request.user.role !== Roles.ADMIN) throw new BadRequestException("您不是管理員，無法變更別人的資料")
        return true
    }
}
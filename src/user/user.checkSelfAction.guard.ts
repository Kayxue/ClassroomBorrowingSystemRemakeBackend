import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Roles } from "../Types/Types";

@Injectable()
export class CheckSelfUserActionGuard implements CanActivate {
    public canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        if (request.user.id !== request.body.userId && request.user.role !== Roles.ADMIN) throw new ForbiddenException("您不是管理員，無法變更或刪除別人的資料")
        return true
    }
}
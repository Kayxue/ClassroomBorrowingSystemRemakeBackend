import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class CheckModifySelfRoleGuard implements CanActivate {
    public canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { body, user } = request
        if (user.id === body.userId && body.role?.length) throw new ForbiddenException("您無法修改自己的角色！")
        return true
    }
}
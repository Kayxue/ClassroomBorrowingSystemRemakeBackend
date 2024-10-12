import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";

@Injectable()
export class CheckModifySelfDepartmentGuard implements CanActivate {
	public canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const { body, user } = request;
		if (user.id === body.userId && body.departmentId?.length)
			throw new ForbiddenException("您無法修改自己所屬處室！");
		return true;
	}
}
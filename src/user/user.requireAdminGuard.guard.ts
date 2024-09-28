import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Roles } from "../Types/Types";

@Injectable()
export class RequireAdminGuard implements CanActivate {
	public async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		if (request.user.role != Roles.ADMIN)
			throw new ForbiddenException("您不是管理員無法進行此操作！");
		return true;
	}
}

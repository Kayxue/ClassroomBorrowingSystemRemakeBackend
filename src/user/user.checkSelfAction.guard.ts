import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Roles } from "../Types/Types.ts";

@Injectable()
export class CheckSelfUserActionGuard implements CanActivate {
	public canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		if (
			request.user.id !== request.body.userId &&
			request.user.role !== Roles.ADMIN
		)
			throw new ForbiddenException("您不是管理員，無法為別人進行任何操作");
		return true;
	}
}

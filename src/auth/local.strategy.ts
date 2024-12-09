import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// @deno-types="@types/passport-local"
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service.ts";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	public constructor(private readonly authService: AuthService) {
		super();
	}

	public async validate(username: string, password: string) {
		const user = await this.authService.validateUser(username, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}

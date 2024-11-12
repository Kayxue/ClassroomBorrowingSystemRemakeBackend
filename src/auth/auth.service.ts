import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service.ts";
import * as argon2 from "jsr:@felix/argon2";
import { passwordSecret } from "../Config.ts";

@Injectable()
export class AuthService {
	public constructor(private userService: UserService) {}

	public async validateUser(username: string, password: string) {
		const user = await this.userService.getUser(username, false);
		if (!user) return null;
		const correct = await argon2.verify(
			user.password,
			password,
			passwordSecret,
		);
		if (user && correct) {
			const { password, ...restUser } = user;
			return restUser;
		}
		return null;
	}
}

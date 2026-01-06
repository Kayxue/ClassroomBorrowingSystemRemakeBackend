import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Algorithm, verify, Version } from "@node-rs/argon2";
import { passwordParallelism, passwordSecret, saltTimeCount } from "../Config";

@Injectable()
export class AuthService {
	public constructor(private userService: UserService) { }

	public async validateUser(username: string, password: string) {
		const user = await this.userService.getUser(username, false);
		if (!user) return null;
		const correct = await verify(
			user.password,
			password,
			{
				algorithm: Algorithm.Argon2id,
				version: Version.V0x13,
				timeCost: saltTimeCount,
				secret: passwordSecret,
				parallelism: passwordParallelism,
			}
		);
		if (user && correct) {
			const { password, ...restUser } = user;
			return restUser;
		}
		return null;
	}
}

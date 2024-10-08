import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	public serializeUser(user: any, done: (err: Error, user: any) => void) {
		done(null, user);
	}

	public deserializeUser(
		payload: any,
		done: (err: Error, payload: string) => void,
	) {
		done(null, payload);
	}
}

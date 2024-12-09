import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service.ts";
import { UserModule } from "../user/user.module.ts";
import { LocalStrategy } from "./local.strategy.ts";
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./session.serializer.ts";

@Module({
	imports: [UserModule, PassportModule],
	providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}

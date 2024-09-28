import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { LocalStrategy } from "./local.strategy";
import { PassportModule } from "@nestjs/passport";
import { SessionSerializer } from "./session.serializer";

@Module({
	imports: [UserModule, PassportModule],
	providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}

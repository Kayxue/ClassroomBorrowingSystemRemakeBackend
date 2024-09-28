import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import expressSession from "express-session";
import passport from "passport";
import { secret } from "./Config";

async function bootstrap() {
	require("dotenv").config();
	const app = await NestFactory.create(AppModule, {
		cors: { origin: true, credentials: true },
	});
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
	);
	app.use(
		expressSession({
			secret: secret,
			resave: false,
			saveUninitialized: false,
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(3001);
}
bootstrap();

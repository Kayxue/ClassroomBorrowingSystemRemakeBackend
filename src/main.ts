import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.ts";
import { ValidationPipe } from "@nestjs/common";
import expressSession from "express-session";
import passport from "passport";
import { sessionSecret } from "./Config.ts";
import "jsr:@std/dotenv/load";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
    // httpsOptions: {
    // 	cert: Deno.readTextFileSync("./src/secret/public-key.pem"),
    // 	key: Deno.readTextFileSync("./src/secret/private-key.pem"),
    // },
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.use(
    expressSession({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3001);
}
bootstrap();

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { DrizzleORMUrl } from 'src/Config';
import * as schema from "../drizzle/schema"

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports:[
    DrizzlePostgresModule.register({
      tag:"drizzledb",
      postgres:{
        url:DrizzleORMUrl,
      },
      config:{schema:{...schema}}
    })
  ]
})
export class UserModule { }

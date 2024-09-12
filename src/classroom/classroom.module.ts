import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { DrizzleORMUrl } from 'src/Config';
import * as schema from "../drizzle/schema"

@Module({
  providers: [ClassroomService],
  controllers: [ClassroomController],
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
export class ClassroomModule { }

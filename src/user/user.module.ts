import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DrizzleMySqlModule } from '@knaadh/nestjs-drizzle-mysql2';
import { DrizzleORMUrl, MySQLConfig } from 'src/Config';
import * as schema from '../drizzle/schema';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [
    DrizzleMySqlModule.register({
      tag: 'drizzledb',
      mysql: {
        connection: 'client',
        config: {
          ...MySQLConfig,
        },
      },
      config: { schema: { ...schema }, mode: 'default' },
    }),
  ],
})
export class UserModule {}

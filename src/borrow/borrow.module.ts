import { Module } from '@nestjs/common';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { DrizzlePostgresModule } from '@knaadh/nestjs-drizzle-postgres';
import { DrizzleORMUrl } from 'src/Config';
import * as schema from "../drizzle/schema"

@Module({
  controllers: [BorrowController],
  providers: [BorrowService],
  imports: [
    DrizzlePostgresModule.register({
      tag: 'drizzledb',
      postgres: {
        url: DrizzleORMUrl,
      },
      config: { schema: { ...schema } },
    }),
  ],
})
export class BorrowModule {}

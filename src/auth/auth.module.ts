import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'nestjs-prisma';

@Module({
    imports:[PrismaModule.forRoot()],
    providers:[AuthService]
})
export class AuthModule {}

import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class AuthService {
    public constructor(prismaService: PrismaService) { }
}

import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
    public constructor(prismaService: PrismaService) { }
}

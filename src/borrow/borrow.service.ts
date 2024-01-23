import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma-service.service';

@Injectable()
export class BorrowService {
    public constructor(private prismaClient: PrismaService) { }
}

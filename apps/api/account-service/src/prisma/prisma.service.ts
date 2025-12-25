import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // Prisma manages the MongoDB connection pool automatically
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

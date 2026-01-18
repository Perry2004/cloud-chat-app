import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@repo/database';

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

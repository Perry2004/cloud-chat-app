import { Module } from '@nestjs/common';
import { ConversationAppController } from './conversation-app.controller';
import { ConversationAppService } from './conversation-app.service';
import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema, EnvVariables } from './conversation-app.validation';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      ignoreEnvFile: true,
      validate: (config) => envSchema.parse(config),
    }),
    CacheModule.registerAsync({
      useFactory: (configService: ConfigService<EnvVariables, true>) => {
        return {
          stores: [
            new KeyvRedis(configService.get('VALKEY_CONNECTION_STRING'), {
              namespace: 'account-service',
            }),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    PrismaModule,
  ],
  controllers: [ConversationAppController],
  providers: [ConversationAppService],
})
export class ConversationAppModule {}

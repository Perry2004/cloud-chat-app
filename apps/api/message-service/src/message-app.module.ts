import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageAppController } from './message-app.controller';
import { MessageAppService } from './message-app.service';
import { envSchema, EnvVariables } from './message-app.validation';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { MessageModule } from './message/message.module';
import KeyvRedis from '@keyv/redis';

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
              namespace: 'message-service',
            }),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    PrismaModule,
    MessageModule,
  ],
  controllers: [MessageAppController],
  providers: [MessageAppService],
})
export class MessageAppModule {}

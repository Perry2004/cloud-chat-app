import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { envSchema, EnvVariables } from './app.validation';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
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
              namespace: 'account-service',
            }),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

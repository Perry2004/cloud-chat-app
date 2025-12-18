import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { testSchema } from '@repo/schema/schema';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const auth0Domain = this.configService.get<string>('AUTH0_DOMAIN');
    console.log('Auth0 Domain from env:', auth0Domain);
    testSchema.parse({ num: 123, str: 'Hello Zod' });
    return 'Hello World!';
  }
}

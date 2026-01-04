import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountAppService {
  constructor(private readonly configService: ConfigService) {}

  healthCheck() {
    return {
      service: 'account-service',
      status: 'ok',
    };
  }
}

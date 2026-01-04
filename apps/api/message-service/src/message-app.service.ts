import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageAppService {
  constructor(private readonly configService: ConfigService) {}

  healthCheck() {
    return {
      service: 'message-service',
      status: 'ok',
    };
  }
}

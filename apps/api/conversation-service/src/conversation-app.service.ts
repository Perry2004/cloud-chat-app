import { Injectable } from '@nestjs/common';

@Injectable()
export class ConversationAppService {
  healthCheck() {
    return {
      service: 'conversation-service',
      status: 'ok',
    };
  }
}

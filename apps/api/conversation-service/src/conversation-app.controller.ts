import { Controller, Get } from '@nestjs/common';
import { ConversationAppService } from './conversation-app.service';

@Controller()
export class ConversationAppController {
  constructor(private readonly appService: ConversationAppService) {}

  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}

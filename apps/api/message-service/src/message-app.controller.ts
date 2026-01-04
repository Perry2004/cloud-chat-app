import { Controller, Get } from '@nestjs/common';
import { MessageAppService } from './message-app.service';

@Controller()
export class MessageAppController {
  constructor(private readonly appService: MessageAppService) {}

  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}

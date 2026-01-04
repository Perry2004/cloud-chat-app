import { Controller, Get } from '@nestjs/common';
import { AccountAppService } from './account-app.service';

@Controller()
export class AccountAppController {
  constructor(private readonly appService: AccountAppService) {}

  @Get('health')
  healthCheck() {
    return this.appService.healthCheck();
  }
}

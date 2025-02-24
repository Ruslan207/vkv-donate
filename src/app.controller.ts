import { Controller, Get, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { MonobankService } from './monobank.service';

@Controller()
export class AppController {
  constructor(private readonly appService: MonobankService) {}

  @Get('init')
  async initUser(@Headers('token') token?: string): Promise<void> {
    if (!token) {
      throw new HttpException('Empty token', HttpStatus.BAD_REQUEST);
    }
    return await this.appService.initWebhooks(token);
  }
}

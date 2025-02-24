import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './models/env-config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MonobankService {
  constructor(private http: HttpService, private configService: ConfigService<EnvConfig>) {}

  async initWebhooks(token: string): Promise<void> {
    await firstValueFrom(this.http.post('https://api.monobank.ua/personal/webhook', {
      webHookUrl: this.configService.get('domain')
    }, {
      headers: {
        'X-Token': token
      }
    }));
  }
}

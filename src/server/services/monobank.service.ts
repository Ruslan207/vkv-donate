import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '../models/env-config';
import { firstValueFrom } from 'rxjs';
import { Jar } from '../models/jar';
import { MonobankTransactionDto } from '../models/monobank-transaction-dto';
import { Transaction } from '../models/transaction';

@Injectable()
export class MonobankService {
  constructor(private http: HttpService, private configService: ConfigService<EnvConfig>) {}

  async initWebhooks(token: string): Promise<void> {
    await firstValueFrom(this.http.post('https://api.monobank.ua/personal/webhook', {
      webHookUrl: `${this.configService.get('DOMAIN')}/webhook`
    }, {
      headers: {
        'X-Token': token
      }
    }));
  }

  async getJars(token: string): Promise<Jar[]> {
    return firstValueFrom(this.http.get('https://api.monobank.ua/personal/client-info', {
      headers: {
        'X-Token': token
      }
    }))
      .then(resp => resp.data.jars)
  }

  transactionAdapter(dto: MonobankTransactionDto): Transaction {
    // TODO: define MonobankTransactionDto and implement adapter
    return {

    } as Transaction
  }
}

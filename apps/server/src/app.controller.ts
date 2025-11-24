import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  MessageEvent,
  Param,
  Patch,
  Post,
  Res,
  Sse
} from '@nestjs/common';
import { MonobankService } from './services/monobank.service';
import { Jar, Transaction, UpdateMessage } from 'models';
import { map, Observable, Subject } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { TransactionsService } from './services/transactions.service';
import { MonobankTransactionDto } from './models/monobank-transaction-dto';

@Controller()
export class AppController {
  constructor(
    private monobankService: MonobankService,
    private eventEmitter: EventEmitter2,
    private transactionService: TransactionsService
  ) {}

  @Get('init')
  async initUser(@Headers('token') token?: string): Promise<void> {
    if (!token) {
      throw new HttpException('Empty token', HttpStatus.BAD_REQUEST);
    }
    return await this.monobankService.initWebhooks(token);
  }

  @Get('webhook')
  onSubscribe(): void {}

  @Post('webhook')
  async storeToDb(@Body() dto: MonobankTransactionDto): Promise<void> {
    const transaction = this.monobankService.transactionAdapter(dto);
    await this.transactionService.addTransaction(transaction);
    this.eventEmitter.emit('topup', transaction);
  }

  @Patch('transactions/:id')
  async patchTransaction(
    @Param('id') id: string,
    @Body() dto: Partial<Transaction>
  ): Promise<void> {
    await this.transactionService.patchTransaction(id, dto);
  }

  @Get('jars')
  async getJars(@Headers('token') token?: string): Promise<Jar[]> {
    if (!token) {
      throw new HttpException('Empty token', HttpStatus.BAD_REQUEST);
    }
    return await this.monobankService.getJars(token);
  }

  @Sse('jars/:id')
  sse(
    @Param('id') id: string,
    @Res() response: Response
  ): Observable<MessageEvent> {
    const messages$ = new Subject<UpdateMessage>();
    setTimeout(async () => {
      const transactions = await this.transactionService.getTransactions(id);
      messages$.next({
        type: 'initial',
        data: transactions,
      });
    });
    const subscription = this.eventEmitter.on(
      'topup',
      (transaction: Transaction) => {
        if (transaction.jarId === id) {
          messages$.next({
            type: 'update',
            data: transaction,
          });
        }
      },
      { objectify: true }
    ) as Exclude<ReturnType<EventEmitter2['on']>, EventEmitter2>;
    response.on('close', () => subscription.off());
    return messages$.pipe(
      map((message) => ({
        data: message,
      }))
    );
  }
}

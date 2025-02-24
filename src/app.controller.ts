import { Controller, Get, Headers, HttpException, HttpStatus, Sse, MessageEvent, Param, Res } from '@nestjs/common';
import { MonobankService } from './services/monobank.service';
import { Jar } from './models/jar';
import { map, Observable, Subject } from 'rxjs';
import { Message, UpdateMessage } from './models/update-message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly monobankService: MonobankService,
    private eventEmitter: EventEmitter2,
  ) {
  }

  @Get('init')
  async initUser(@Headers('token') token?: string): Promise<void> {
    if (!token) {
      throw new HttpException('Empty token', HttpStatus.BAD_REQUEST);
    }
    return await this.monobankService.initWebhooks(token);
  }

  @Get('webhook')
  storeToDb(): void {
    // TODO: store to db
    // TODO: emit event
  }

  @Get('jars')
  async getJars(@Headers('token') token?: string): Promise<Jar[]> {
    if (!token) {
      throw new HttpException('Empty token', HttpStatus.BAD_REQUEST);
    }
    return await this.monobankService.getJars(token);
  }

  @Sse('jars/:id')
  sse(@Param('id') id: string, @Res() response: Response): Observable<MessageEvent> {
    const messages$ = new Subject<UpdateMessage>();
    setTimeout(() => {
      // TODO: pull from db and push initial list
    });
    const subscription = this.eventEmitter.on('topup', (transaction: {
      jarId: string;
      message: Message;
    }) => {
      if (transaction.jarId === id) {
        messages$.next({
          type: 'update',
          data: transaction.message,
        });
      }
    }, {objectify: true}) as Exclude<ReturnType<EventEmitter2['on']>, EventEmitter2>;
    response.on('close', () => subscription.off());
    return messages$.pipe(
      map(message => ({
        data: message,
      }))
    );
  }
}

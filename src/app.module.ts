import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonobankService } from './services/monobank.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfig } from './models/env-config';
import { TransactionSchema } from './schemas/transaction.schema';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<EnvConfig>) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Transactions', schema: TransactionSchema }])
  ],
  controllers: [AppController],
  providers: [MonobankService, TransactionsService],
})
export class AppModule {}

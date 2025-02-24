import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonobankService } from './services/monobank.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), EventEmitterModule.forRoot()],
  controllers: [AppController],
  providers: [MonobankService],
})
export class AppModule {}

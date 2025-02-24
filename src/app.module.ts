import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MonobankService } from './monobank.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MonobankService],
})
export class AppModule {}

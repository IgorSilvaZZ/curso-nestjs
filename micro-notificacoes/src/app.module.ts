/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { ProxyRMQModule } from './proxymq/proxymq.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: '8005',
        secure: false,
        ignoreTLS: true,
      },
    }),
    ProxyRMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

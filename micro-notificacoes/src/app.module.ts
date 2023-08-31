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
        host: 'sandbox.smtp.mailtrap.io',
        port: '2525',
        auth: {
          user: '63e8be99c928e0',
          pass: '40f83414bac8f2',
        },
      },
    }),
    ProxyRMQModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

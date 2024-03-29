/* eslint-disable prettier/prettier */

import { NestFactory } from '@nestjs/core';

import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672/smartranking'],
      noAck: false,
      queue: 'challenges',
    },
  });

  Date.prototype.toJSON = function (): any {
    return this.toLocaleDateString() + ' ' + this.toLocaleTimeString();
  };

  await app.listen();
}
bootstrap();

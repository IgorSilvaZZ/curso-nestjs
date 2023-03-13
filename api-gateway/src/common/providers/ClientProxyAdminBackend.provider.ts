/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyAdminBackend {
  clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  emit(topic: string, data: any) {
    this.clientAdminBackend.emit(topic, data);
  }

  send(topic: string, data: any) {
    return this.clientAdminBackend.send(topic, data);
  }
}

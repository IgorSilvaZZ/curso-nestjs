/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private readonly configService: ConfigService) {}

  getClientProxyInstance(): ClientProxy {
    const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [RABBITMQ_URL],
        queue: 'admin-backend',
      },
    });
  }
}

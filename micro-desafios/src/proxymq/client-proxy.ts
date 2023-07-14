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

  private RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');

  getClientProxyInstanceAdminBackEnd(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: 'admin-backend',
      },
    });
  }

  getClientProxyInstanceChallenges(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.RABBITMQ_URL],
        queue: 'challenges',
      },
    });
  }
}

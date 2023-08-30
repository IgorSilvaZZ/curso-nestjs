/* eslint-disable prettier/prettier */

import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { IDesafio } from './interfaces/desafio.interface';

import { AppService } from './app.service';
import { ackMessageError } from './utils/ackMessageError';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  @EventPattern('notificacao-novo-desafio')
  async enviarEmailAdversario(
    @Payload() desafio: IDesafio,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.appService.enviarEmailParaAdversario(desafio);
      await channel.ack(originalMessage);
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }
}

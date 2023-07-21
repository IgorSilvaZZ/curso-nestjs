/* eslint-disable prettier/prettier */

import { Controller } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { IPartida } from './interfaces/partidas.interface';

import { PartidasService } from './partidas.service';

import { ackMessageError } from '../utils/ackMessageError';

@Controller()
export class PartidasController {
  constructor(private readonly partidaService: PartidasService) {}

  logger = new Logger(PartidasController.name);

  @EventPattern('criar-partida')
  async criarPartida(
    @Payload() novaPartida: IPartida,
    @Ctx() context: RmqContext,
  ): Promise<IPartida> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const partidaCriada = await this.partidaService.criarPartida(novaPartida);

      await channel.ack(originalMessage);

      return partidaCriada;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }
}

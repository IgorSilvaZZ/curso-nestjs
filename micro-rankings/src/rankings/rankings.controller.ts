/* eslint-disable prettier/prettier */

import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { IPartida } from './interfaces/partida.interface';
import { RankingsService } from './rankings.service';

import { ackMessageError } from '../utils/ackMessageError';

@Controller()
export class RankingsController {
  constructor(private readonly rankingService: RankingsService) {}

  private logger = new Logger(RankingsController.name);

  @EventPattern('processar-partida')
  async processarPartida(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const idPartida: string = data.idPartida;
      const partida: IPartida = data.partida;

      await this.rankingService.processarPartida(idPartida, partida);

      await channel.ack(originalMessage);
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);

      await channel.nack(originalMessage);
    }
  }

  @EventPattern('consultar-rankings')
  async consultarRakings(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const idCategoria: string = data.idCategoria;
      const dataRef: string = data.dataRef;

      const rankings = await this.rankingService.consultarRankings(
        idCategoria,
        dataRef,
      );

      await channel.ack(originalMessage);

      return rankings;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);

      await channel.nack(originalMessage);
    }
  }
}

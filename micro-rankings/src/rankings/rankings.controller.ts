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
      this.logger.log(`data: ${JSON.stringify(data)}`);

      const idPartida: string = data.idPartida;
      const partida: IPartida = data.partida;

      await this.rankingService.processarPartida(idPartida, partida);

      await channel.ack(originalMessage);
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }
}

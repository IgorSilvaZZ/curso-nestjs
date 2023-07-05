/* eslint-disable prettier/prettier */

import { Controller } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { DesafiosService } from './desafios.service';

import { IDesafio } from './interfaces/desafio.interface';

const acksErros: string[] = ['E11000'];

async function ackMessageError(
  channel: any,
  originalMessage: any,
  messageError: string,
) {
  const filterAckError = acksErros.filter((ackError) =>
    messageError.includes(ackError),
  );

  if (filterAckError) {
    await channel.ack(originalMessage);
  }
}

@Controller('desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  logger = new Logger(DesafiosController.name);

  @EventPattern('criar-desafio')
  async criarDesafio(
    @Payload() desafio: IDesafio,
    @Ctx() context: RmqContext,
  ): Promise<IDesafio> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const novoDesafio = await this.desafiosService.criarDesafio(desafio);

      await channel.ack(originalMessage);

      return novoDesafio;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @MessagePattern('consultar-desafio')
  async consultarDesafiosPorId(
    @Payload() idDesafio: string,
    @Ctx() context: RmqContext,
  ): Promise<IDesafio> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const desafios = await this.desafiosService.consultarDesafioPeloId(
        idDesafio,
      );

      await channel.ack(originalMessage);

      return desafios;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @MessagePattern('consultar-desafios-jogador')
  async consultarDesafiosJogador(
    @Payload() idJogaodr: string,
    @Ctx() context: RmqContext,
  ): Promise<IDesafio[]> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const desafiosJogador =
        await this.desafiosService.consultarDesafiosDeUmJogador(idJogaodr);

      await channel.ack(originalMessage);

      return desafiosJogador;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @MessagePattern('consultar-desafios')
  async consultarDesafios(_, @Ctx() context: RmqContext): Promise<IDesafio[]> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const desafios = await this.consultarDesafios();

      await channel.ack(originalMessage);

      return desafios;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }
}

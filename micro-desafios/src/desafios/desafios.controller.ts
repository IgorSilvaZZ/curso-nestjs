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

import { ackMessageError } from '../utils/ackMessageError';

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

  @EventPattern('atualizar-desafio')
  async atualizarDesafio(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<IDesafio> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const idDesafio: string = data.idDesafio;

      const desafio: IDesafio = data.desafio;

      const desafioAtualizado = await this.desafiosService.atualizarDesafio(
        idDesafio,
        desafio,
      );

      await channel.ack(originalMessage);

      return desafioAtualizado;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @EventPattern('atualizar-desafio-partida')
  async atualizarDesafioPartida(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const idPartida: string = data.idPartida;
      const desafio: IDesafio = data.desafio;

      await this.desafiosService.atualizarDesafioPartida(idPartida, desafio);

      await channel.ack(originalMessage);
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @EventPattern('deletar-desafio')
  async deletarDesafio(
    @Payload() idDesafio: string,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.desafiosService.deletarDesafio(idDesafio);

      await channel.ack(originalMessage);
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
      const desafio = await this.desafiosService.consultarDesafioPeloId(
        idDesafio,
      );

      return desafio;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    } finally {
      await channel.ack(originalMessage);
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
      const desafios = await this.desafiosService.consultarTodosDesafios();

      await channel.ack(originalMessage);

      return desafios;
    } catch (error) {
      await ackMessageError(channel, originalMessage, error.message);
    }
  }
}

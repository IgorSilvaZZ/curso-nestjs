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

import { IJogador } from './interfaces/jogador.interface';

import { CategoriasService } from '../categorias/categorias.service';
import { JogadoresService } from './jogadores.service';

const ackErros: string[] = ['E11000'];

async function ackMessageError(
  channel: any,
  originalMessage: any,
  messageError: string,
) {
  const filterAckError = ackErros.filter((ackError) =>
    messageError.includes(ackError),
  );

  if (filterAckError) {
    await channel.ack(originalMessage);
  }
}

@Controller()
export class JogadoresController {
  constructor(
    private readonly jogadoresService: JogadoresService,
    private categoriaService: CategoriasService,
  ) {}

  logger = new Logger(JogadoresController.name);

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(_, @Ctx() context: RmqContext): Promise<IJogador[]> {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      this.logger.log('CHAMOU consultar-jogadores');
      return await this.jogadoresService.consultarTodosJogadores();
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-jogador')
  async consultarJogador(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      return await this.jogadoresService.consultarJogadorPeloId(id);
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('criar-jogador')
  async criarJogador(@Payload() criarJogador: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const idCategoria: string = criarJogador.idCategoria;

      await this.categoriaService.consultarCategoriaPeloId(idCategoria);

      const jogador: IJogador = criarJogador.jogador;

      const novoJogador = await this.jogadoresService.criarJogador(jogador);

      await channel.ack(originalMessage);

      return novoJogador;
    } catch (error) {
      this.logger.log(`Erro ao criar jogador!!`);
      this.logger.log(error.message);

      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @EventPattern('atualizar-jogador')
  async atualizarJogador(
    @Payload() atualizarJogador: any,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id: string = atualizarJogador.id;

      const jogador: IJogador = atualizarJogador.jogador;

      const jogadorAtualizado = await this.jogadoresService.atualizarJogador(
        id,
        jogador,
      );

      await channel.ack(originalMessage);

      return jogadorAtualizado;
    } catch (error) {
      this.logger.log(`Erro ao atualizar jogador!!`);
      this.logger.log(error.message);

      await ackMessageError(channel, originalMessage, error.message);
    }
  }

  @EventPattern('deletar-jogador')
  async deletarJogador(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.jogadoresService.deletarJogador(id);
    } catch (error) {
      this.logger.log(`Erro ao deletar jogador!!`);
      this.logger.log(error.message);

      await ackMessageError(channel, originalMessage, error.message);
    }
  }
}

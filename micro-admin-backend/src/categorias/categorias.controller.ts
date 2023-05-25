/* eslint-disable prettier/prettier */

import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ICategoria } from './interfaces/categoria.interface';

import { CategoriasService } from './categorias.service';

const ackErros: string[] = ['E11000'];

@Controller()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  logger = new Logger(CategoriasController.name);

  // Se registrando no topico criar categoria, assim escutando toda emissao de o emissor nesse evento no message broker
  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: ICategoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    // this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.categoriasService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error.message)}`);

      const filterAckError = ackErros.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      if (_id) {
        return await this.categoriasService.consultarCategoriaPeloId(_id);
      } else {
        return await this.categoriasService.consultarCategorias();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const _id: string = data.id;

      const categoria: ICategoria = data.categoria;

      // this.logger.log(`id: ${JSON.stringify(_id)}`);
      // this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

      await this.categoriasService.atualizarCategoria(_id, categoria);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.log(`Error: ${error.message}`);

      const filterAckError = ackErros.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError) {
        await channel.ack(originalMessage);
      }
    }
  }
}

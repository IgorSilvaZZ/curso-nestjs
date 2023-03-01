import { Controller } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import {
  Payload,
  EventPattern,
  MessagePattern,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { ICategoria } from './interfaces/categorias/categoria.interface';

const ackErros: string[] = ['E11000'];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  // Se registrando no topico criar categoria, assim escutando toda emissao de o emissor nesse evento no message broker
  @EventPattern('criar-categoria')
  async criarCategoria(
    @Payload() categoria: ICategoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    try {
      await this.appService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`erro: ${JSON.stringify(error.message)}`);

      ackErros.map(async (ackErro) => {
        if (error.message.includes(ackErro)) {
          await channel.ack(originalMessage);
        }
      });
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(@Payload() _id: string) {
    if (_id) {
      return await this.appService.consultarCategoriaPeloId(_id);
    } else {
      return await this.appService.consultarCategorias();
    }
  }
}

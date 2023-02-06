import { Controller } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { Payload, EventPattern, MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ICategoria } from './interfaces/categorias/categoria.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new Logger(AppController.name);

  // Se registrando no topico criar categoria, assim escutando toda emissao de o emissor nesse evento no message broker
  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: ICategoria) {
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);

    await this.appService.criarCategoria(categoria);
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

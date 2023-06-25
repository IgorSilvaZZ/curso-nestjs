/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { IJogador } from '../jogadores/interfaces/jogador.interface';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(DesafiosController.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  private clientChallenges =
    this.clientProxySmartRaking.getClientProxyInstanceChallenges();

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDTO: CriarDesafioDTO) {
    // Verificar se os jogadores estao cadastrados
    const jogadoresCadastrados: IJogador[] = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogadores', ''),
    );

    // this.logger.log(JSON.stringify(criarDesafioDTO.jogadores));

    const jogadoresNaoCadastrados = criarDesafioDTO.jogadores.filter(
      (jogadorCadastrado) =>
        !jogadoresCadastrados.some(
          (jogador) => jogador._id === jogadorCadastrado._id,
        ),
    );

    if (jogadoresNaoCadastrados.length > 0) {
      throw new BadRequestException(
        `Jogadore(s) ${jogadoresNaoCadastrados
          .map((item) => item._id)
          .join(',')} não cadastrados!`,
      );
    }

    // Verificar se os jogadores pertecem ao uma categoria
    // const jogadoresCategoria = criarDesafioDTO.jogadores.map(jogador => lastValueFrom())

    return;

    // Veriricar se o solicitante é um jogador da partida

    // Verificar se a categoria esta cadastrada

    // this.clientChallenges.emit('criar-desafio', criarDesafioDTO);
  }
}

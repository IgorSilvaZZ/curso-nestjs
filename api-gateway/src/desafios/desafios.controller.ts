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
    const jogadoresCadastrados = this.clientAdminBackend.send(
      'consultar-jogadores',
      '',
    );

    // this.logger.log(JSON.stringify(jogadoresCadastrados));

    if (Array.isArray(jogadoresCadastrados)) {
      const jogadoresNaoCadastrados = jogadoresCadastrados.filter(
        (jogadorCadastrado) =>
          !criarDesafioDTO.jogadores.some(
            (jogador) => jogador._id === jogadorCadastrado._id,
          ),
      );

      if (jogadoresNaoCadastrados.length > 0) {
        throw new BadRequestException(
          `Jogadore(s) ${jogadoresNaoCadastrados.join(',')} não cadastrados!`,
        );
      }
    } else {
      throw new BadRequestException(
        'Erro ao verificar se os jogadores estão cadastrados!',
      );
    }

    return;

    // Verificar se os jogadores pertecem ao uma categoria

    // Veriricar se o solicitante é um jogador da partida

    // Verificar se a categoria esta cadastrada

    // this.clientChallenges.emit('criar-desafio', criarDesafioDTO);
  }
}

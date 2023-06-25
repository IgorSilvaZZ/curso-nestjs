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
          .join(', ')} não cadastrado(s)!`,
      );
    }

    // Verificar se a categoria esta cadastrada
    await lastValueFrom(
      this.clientAdminBackend.send(
        'consultar-categorias',
        criarDesafioDTO.categoria,
      ),
    );

    // Verificando se o solicitante é um jogador da partida
    const jogadorFazParteDesafio = criarDesafioDTO.jogadores.find(
      (jogador) => jogador._id === criarDesafioDTO.solicitante,
    );

    if (!jogadorFazParteDesafio) {
      throw new BadRequestException(
        `O Solicitante com id ${criarDesafioDTO.solicitante}, não faz parte do desafio! Informe um ID solicitante que faça parte do desafio!`,
      );
    }

    // Verificando se o jogador realmente pertence a categoria que foi informada
    const jogadorCategoriaNaoCorrespondente = jogadoresCadastrados.filter(
      (jogador) => jogador.categoria !== criarDesafioDTO.categoria,
    );

    if (jogadorCategoriaNaoCorrespondente.length > 0) {
      throw new BadRequestException(
        `Jogadore(s) ${jogadorCategoriaNaoCorrespondente
          .map((item) => item.nome)
          .join(', ')} não está com a categoria correspondente!`,
      );
    }

    return await lastValueFrom(
      this.clientChallenges.emit('criar-desafio', criarDesafioDTO),
    );
  }
}

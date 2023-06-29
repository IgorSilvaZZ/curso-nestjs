/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Logger,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Put,
  Delete,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';
import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { AtualizarDesafioDTO } from './dtos/atualizarDesafio.dto';
import { IJogador } from '../jogadores/interfaces/jogador.interface';
import { IDesafio } from './interfaces/desafio.interface';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';

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

  @Get('/:idJogador')
  @UsePipes(ValidationPipe)
  async consultarDesafiosJogador(
    @Param('idJogador', ValidacaoParametrosPipe) idJogador: string,
  ) {
    const jogadorCadastrado = await lastValueFrom(
      this.clientAdminBackend.send('consultar-jogador', idJogador),
    );

    if (!jogadorCadastrado) {
      throw new BadRequestException(
        `O Jogador com ${idJogador} não está cadastrado!`,
      );
    }

    const desafios = await lastValueFrom(
      this.clientChallenges.send('consultar-desafios-jogador', idJogador),
    );

    return desafios;
  }

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

  @Put('/:idDesafio')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('idDesafio', ValidacaoParametrosPipe) idDesafio: string,
    @Body() atualizarDesafioDTO: AtualizarDesafioDTO,
  ) {
    const desafioCadastrado: IDesafio = await lastValueFrom(
      this.clientChallenges.send('consultar-categoria', idDesafio),
    );

    if (!desafioCadastrado) {
      throw new BadRequestException(
        `Desafio com id: ${idDesafio}, não esta cadastrado!`,
      );
    }

    if (desafioCadastrado.status !== IDesafioStatusEnum.PENDENTE) {
      throw new BadRequestException(
        `O Desafio está com status invalido! Status Pendente apenas pode ser atualizado!!`,
      );
    }

    const desafioAtualizar = {
      ...atualizarDesafioDTO,
      idDesafio,
    };

    const desafioAtualizado = await lastValueFrom(
      this.clientChallenges.emit('atualizar-desafio', desafioAtualizar),
    );

    return desafioAtualizado;
  }

  @Delete('/:idDesafio')
  @UsePipes(ValidationPipe)
  async deletarDesafio(
    @Param('idDesafio', ValidacaoParametrosPipe) idDesafio: string,
  ) {
    const desafioCadastrado = await lastValueFrom(
      this.clientChallenges.send('consultar-categoria', idDesafio),
    );

    if (!desafioCadastrado) {
      throw new BadRequestException(
        `Desafio com id: ${idDesafio} não esta cadastrado!`,
      );
    }

    await lastValueFrom(
      this.clientChallenges.emit('deletar-desafio', idDesafio),
    );
  }
}

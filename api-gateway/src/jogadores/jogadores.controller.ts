/* eslint-disable prettier/prettier */

import {
  Controller,
  Logger,
  Post,
  ValidationPipe,
  Body,
  Get,
  Put,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Delete, Query, UsePipes } from '@nestjs/common/decorators';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(JogadoresController.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    const jogador = {
      nome: criarJogadorDTO.nome,
      email: criarJogadorDTO.email,
      telefoneCelular: criarJogadorDTO.telefoneCelular,
    };

    const idCategoria = criarJogadorDTO.idCategoria;

    const categoria = await this.clientAdminBackend.send(
      'consultar-categorias',
      idCategoria,
    );

    if (categoria) {
      await this.clientAdminBackend.emit('criar-jogador', {
        idCategoria,
        jogador,
      });
    } else {
      throw new BadRequestException('Categoria não cadastrada!');
    }
  }

  @Get()
  consultarJogadores(): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', '');
  }

  @Get()
  consultarJogador(
    @Query('idJogador', ValidacaoParametrosPipe) _id: string,
  ): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogador', _id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  atualizarJogador(
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDTO,
    });
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', _id);
  }
}

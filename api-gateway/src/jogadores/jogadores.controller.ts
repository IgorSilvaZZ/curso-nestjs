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
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Delete, Query, UsePipes } from '@nestjs/common/decorators';

import { ClientProxyAdminBackend } from '../common/providers/ClientProxyAdminBackend.provider';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly clientAdminBackend: ClientProxyAdminBackend) {}

  private logger = new Logger(JogadoresController.name);

  @Post()
  @UsePipes(ValidationPipe)
  criarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    const jogador = {
      nome: criarJogadorDTO.nome,
      email: criarJogadorDTO.email,
      telefoneCelular: criarJogadorDTO.telefoneCelular,
    };

    this.clientAdminBackend.emit('criar-jogador', {
      idCategoria: criarJogadorDTO.idCategoria,
      jogador,
    });
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

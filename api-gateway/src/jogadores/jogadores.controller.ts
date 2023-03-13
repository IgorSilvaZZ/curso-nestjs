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
import { Query, UsePipes } from '@nestjs/common/decorators';
import { ClientProxyAdminBackend } from 'src/common/providers/ClientProxyAdminBackend.provider';
import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly clientAdminBackend: ClientProxyAdminBackend) {}

  private logger = new Logger(JogadoresController.name);

  @Post()
  @UsePipes(ValidationPipe)
  criarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    this.clientAdminBackend.emit('criar-jogador', criarJogadorDTO);
  }

  @Get()
  consultarJogadores(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  atualizarJogador(
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      jogador: atualizarJogadorDTO,
    });
  }
}

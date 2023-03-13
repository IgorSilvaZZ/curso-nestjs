/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { ClientProxyAdminBackend } from '../common/providers/ClientProxyAdminBackend.provider';

import { AtualizarCategoriaDTO } from './dtos/atualizarCategoria.dto';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly clientAdminBackend: ClientProxyAdminBackend) {}

  private logger = new Logger(CategoriasController.name);

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDTO: CriaCategoriaDTO) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDTO);
  }

  @Get()
  consultarCategorias(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDTO,
    });
  }

  @Delete('/:_id')
  deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', _id);
  }
}

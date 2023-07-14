/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

import { AtualizarCategoriaDTO } from './dtos/atualizarCategoria.dto';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';
import { ClientProxySmartRanking } from 'src/proxymq/client-proxy';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  private logger = new Logger(CategoriasController.name);

  private clientAdminBackend =
    this.clientProxySmartRaking.getClientProxyInstance();

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDTO: CriaCategoriaDTO) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoriaDTO);
  }

  @Get()
  async consultarCategorias() {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-categorias', ''),
    );
  }

  @Get('/:idCategoria')
  async consultarCategoriaPeloId(@Param('idCategoria') idCategoria: string) {
    return await lastValueFrom(
      this.clientAdminBackend.send('consultar-categoria', idCategoria),
    );
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    const categoriaEncontrada = await lastValueFrom(
      this.clientAdminBackend.send('consultar-categoria', _id),
    );

    if (!categoriaEncontrada) {
      throw new BadRequestException(`Categoria com id: ${_id} não encontrada!`);
    }

    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoriaDTO,
    });
  }
}

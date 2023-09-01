/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

import { AtualizarCategoriaDTO } from './dtos/atualizarCategoria.dto';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';

import { CategoriasService } from './categorias.service';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoriaDTO: CriaCategoriaDTO) {
    this.categoriasService.criarCategoria(criarCategoriaDTO);
  }

  @Get()
  async consultarCategorias() {
    return await this.categoriasService.consultarCategorias();
  }

  @Get('/:idCategoria')
  async consultarCategoriaPeloId(@Param('idCategoria') idCategoria: string) {
    return await this.categoriasService.consultarCategoriaPeloId(idCategoria);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() atualizarCategoriaDTO: AtualizarCategoriaDTO,
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ) {
    await this.categoriasService.atualizarCategoria(_id, atualizarCategoriaDTO);
  }
}

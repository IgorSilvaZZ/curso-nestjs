/* eslint-disable prettier/prettier */

import { Controller, Body, Post, Get } from '@nestjs/common';
import { Param, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';

import { CategoriasService } from './categorias.service';
import { CriaCategoriaDTO } from './dtos/criarCategoria.dto';
import { ICategoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDTO: CriaCategoriaDTO,
  ): Promise<ICategoria> {
    return await this.categoriasService.criarCategoria(criarCategoriaDTO);
  }

  @Get()
  async consultarCategorias(): Promise<ICategoria[]> {
    return await this.categoriasService.consultarTodasCategorias();
  }

  @Get('/:categoria')
  async consultarCategoriaPorId(
    @Param('categoria') categoria: string,
  ): Promise<ICategoria> {
    return await this.categoriasService.consultarCategoriaPeloId(categoria);
  }
}

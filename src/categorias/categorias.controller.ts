/* eslint-disable prettier/prettier */

import { Controller, Body, Post } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';
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
}

/* eslint-disable prettier/prettier */

import { Body, Controller, Post, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';
import { DesafiosService } from './desafios.service';

import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { IDesafio } from './interfaces/desafios.interface';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDTO: CriarDesafioDTO,
  ): Promise<IDesafio> {
    return await this.desafiosService.criarDesafio(criarDesafioDTO);
  }
}

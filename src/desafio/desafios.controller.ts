/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';

import { DesafiosService } from './desafios.service';
import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { AtualizarDesafioDTO } from './dtos/atualizarDesafio.dto';
import { IDesafio } from './interfaces/desafios.interface';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuirDesafioPartida.dto';

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

  @Get()
  @UsePipes(ValidationPipe)
  async consultarDesafios(
    @Query('idJogador') idJogador: string,
  ): Promise<IDesafio[] | IDesafio | null | undefined> {
    if (idJogador) {
      return await this.desafiosService.consultarDesafiosDeUmJogador(idJogador);
    } else {
      return await this.desafiosService.consultarDesafios();
    }
  }

  @Put('/:idDesafio')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('idDesafio') idDesafio: string,
    @Body() atualizarDesafioDTO: AtualizarDesafioDTO,
  ): Promise<void> {
    await this.desafiosService.atualizarDesafio(idDesafio, atualizarDesafioDTO);
  }

  @Delete('/:idDesafio')
  @UsePipes(ValidationPipe)
  async deletarDesafio(@Param('idDesafio') idDesafio: string) {
    await this.desafiosService.deletarDesafio(idDesafio);
  }

  @Post('/:idDesafio/partida')
  async atribuirPartidaDesafio(
    @Body() atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
    @Param('idDesafio') idDesafio: string,
  ): Promise<IDesafio | null> {
    return await this.desafiosService.atribuirDesafioPartida(
      idDesafio,
      atribuirDesafioPartidaDTO,
    );
  }
}

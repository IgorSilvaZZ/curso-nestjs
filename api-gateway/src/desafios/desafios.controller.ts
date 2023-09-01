/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
} from '@nestjs/common';

import { CriarDesafioDTO } from './dtos/criarDesafio.dto';
import { AtualizarDesafioDTO } from './dtos/atualizarDesafio.dto';
import { AtribuirDesafioPartidaDTO } from './dtos/atribuirDesafioPartida.dto';

import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';
import { DesafiosService } from './desafios.service';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Get('/:idJogador')
  @UsePipes(ValidationPipe)
  async consultarDesafiosJogador(
    @Param('idJogador', ValidacaoParametrosPipe) idJogador: string,
  ) {
    const desafiosJogador = await this.desafiosService.consultarDesafiosJogador(
      idJogador,
    );

    return desafiosJogador;
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(@Body() criarDesafioDTO: CriarDesafioDTO) {
    const desafio = await this.desafiosService.criarDesafio(criarDesafioDTO);

    return desafio;
  }

  @Post('/:idDesafio/partida')
  @UsePipes(ValidationPipe)
  async atribuirDesafioPartida(
    @Param('idDesafio', ValidacaoParametrosPipe) idDesafio: string,
    @Body() atribuirDesafioPartidaDTO: AtribuirDesafioPartidaDTO,
  ) {
    const partidaAtribuida = await this.desafiosService.atribuirDesafioPartida(
      idDesafio,
      atribuirDesafioPartidaDTO,
    );

    return partidaAtribuida;
  }

  @Put('/:idDesafio')
  @UsePipes(ValidationPipe)
  async atualizarDesafio(
    @Param('idDesafio', ValidacaoParametrosPipe) idDesafio: string,
    @Body() atualizarDesafioDTO: AtualizarDesafioDTO,
  ) {
    const desafioAtualizado = await this.atualizarDesafio(
      idDesafio,
      atualizarDesafioDTO,
    );

    return desafioAtualizado;
  }

  @Delete('/:idDesafio')
  @UsePipes(ValidationPipe)
  async deletarDesafio(
    @Param('idDesafio', ValidacaoParametrosPipe) idDesafio: string,
  ) {
    await this.desafiosService.deletarDesafio(idDesafio);
  }
}

/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Delete, Put } from '@nestjs/common';
import { Param, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';

import { AtualizarJogadorDTO } from './dtos/atualizarjogador.dto';
import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { IJogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() criarJogadorDTO: CriarJogadorDTO,
  ): Promise<IJogador> {
    return await this.jogadoresService.criarJogador(criarJogadorDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
    @Body() atualizarJogadorDTO: AtualizarJogadorDTO,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDTO);
  }

  @Get()
  async consultarJogadores(): Promise<IJogador[] | IJogador> {
    return this.jogadoresService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPorId(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ): Promise<IJogador | null> {
    return await this.jogadoresService.consultarJogadorPeloId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    return await this.jogadoresService.deletarJogador(_id);
  }
}

/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Delete } from '@nestjs/common';
import { Query, UsePipes } from '@nestjs/common/decorators';
import { ValidationPipe } from '@nestjs/common/pipes';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { IJogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-parametros.pipe';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarAtualizarJogador(
    @Body() criarJogadorDTO: CriarJogadorDTO,
  ): Promise<void> {
    return await this.jogadoresService.criarAtualizarJogador(criarJogadorDTO);
  }

  @Get()
  async consultarJogadores(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
  ): Promise<IJogador[] | IJogador> {
    if (email) {
      return this.jogadoresService.consultarJogadoresPeloEmail(email);
    } else {
      return this.jogadoresService.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogador(
    @Query('email', JogadoresValidacaoParametrosPipe) email: string,
  ): Promise<void> {
    return await this.jogadoresService.deletarJogador(email);
  }
}

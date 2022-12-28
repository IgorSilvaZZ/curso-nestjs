/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Delete } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { IJogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    this.jogadoresService.criarAtualizarJogador(criarJogadorDTO);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<IJogador[] | IJogador> {
    if (email) {
      return this.jogadoresService.consultarJogadoresPeloEmail(email);
    } else {
      return this.jogadoresService.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    this.jogadoresService.deletarJogador(email);
  }
}

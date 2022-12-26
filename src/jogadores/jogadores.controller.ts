/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDTO } from './dtos/criarJogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDTO: CriarJogadorDTO) {
    return {
      criarJogadorDTO,
    };
  }
}

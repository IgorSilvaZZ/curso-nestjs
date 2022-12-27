/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { IJogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  private jogadores: IJogador[] = [];

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    this.criar(criarJogadorDTO);
  }

  private criar(criarJogadorDTO: CriarJogadorDTO): void {
    const { email, nome, telefoneCelular } = criarJogadorDTO;

    const jogador: IJogador = {
      _id: randomUUID(),
      nome,
      email,
      telefoneCelular,
      ranking: 'A',
      posicaoRanking: 1,
      urlFotoJogador: 'https://avatars.githubusercontent.com/u/65422544?v=4',
    };

    this.logger.log(jogador);

    this.jogadores.push(jogador);
  }
}

/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { randomUUID } from 'node:crypto';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { IJogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  private readonly logger = new Logger(JogadoresService.name);

  private jogadores: IJogador[] = [];

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = this.encontrarJogadorPorEmail(email);

    if (jogadorEncontrado) {
      this.atualizarJogador(jogadorEncontrado, criarJogadorDTO);
    } else {
      this.criar(criarJogadorDTO);
    }
  }

  async consultarTodosJogadores(): Promise<IJogador[]> {
    return this.jogadores;
  }

  async consultarJogadoresPeloEmail(email: string): Promise<IJogador> {
    const jogadorEncontrado = this.encontrarJogadorPorEmail(email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador não encontrado com email ${email} não encontrado!`,
      );
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = this.encontrarJogadorPorEmail(email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador não encontrado com email ${email} não encontrado!`,
      );
    }

    this.jogadores = this.jogadores.filter(
      (jogador) => jogador.email !== email,
    );
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

  // Parametro jogador => Jogador que já tem na base
  // Paremtro jogadorDTO => Informações que vieram da requisição http
  private atualizarJogador(
    jogadorEncontrado: IJogador,
    jogadorDTO: CriarJogadorDTO,
  ): void {
    const { nome } = jogadorDTO;

    jogadorEncontrado.nome = nome;
  }

  private encontrarJogadorPorEmail(email: string): IJogador | undefined {
    const jogadorEncontrado = this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    return jogadorEncontrado;
  }
}

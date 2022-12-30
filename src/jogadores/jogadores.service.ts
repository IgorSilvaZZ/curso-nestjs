/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CriarJogadorDTO } from './dtos/criarJogador.dto';
import { IJogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  // Objeto para realizar loggs para debug na aplicação
  // private readonly logger = new Logger(JogadoresService.name);

  constructor(
    @InjectModel('jogador') private readonly jogadorModel: Model<IJogador>,
  ) {}

  async criarAtualizarJogador(criarJogadorDTO: CriarJogadorDTO): Promise<void> {
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = await this.encontrarJogadorPorEmail(email);

    if (jogadorEncontrado) {
      await this.atualizarJogador(jogadorEncontrado, criarJogadorDTO);
    } else {
      await this.criar(criarJogadorDTO);
    }
  }

  async consultarTodosJogadores(): Promise<IJogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<IJogador> {
    const jogadorEncontrado = await this.encontrarJogadorPorEmail(email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador não encontrado com email ${email} não encontrado!`,
      );
    }

    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<any> {
    const jogadorEncontrado = await this.encontrarJogadorPorEmail(email);

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador não encontrado com email ${email} não encontrado!`,
      );
    }

    return await this.jogadorModel.deleteOne({ email }).exec();
  }

  private async criar(criarJogadorDTO: CriarJogadorDTO): Promise<IJogador> {
    const jogador = new this.jogadorModel(criarJogadorDTO);

    return await jogador.save();
  }

  // Parametro jogador => Jogador que já tem na base
  // Paremtro jogadorDTO => Informações que vieram da requisição http
  private async atualizarJogador(
    jogadorEncontrado: IJogador,
    jogadorDTO: CriarJogadorDTO,
  ): Promise<IJogador | null> {
    return await this.jogadorModel
      .findOneAndUpdate({ email: jogadorEncontrado.email }, jogadorDTO)
      .exec();
  }

  private async encontrarJogadorPorEmail(
    email: string,
  ): Promise<IJogador | null> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    return jogadorEncontrado;
  }
}

/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IJogador } from './interfaces/jogador.interface';
import { Jogador } from './interfaces/jogador.schema';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  logger = new Logger(JogadoresService.name);

  async criarJogador(criarJogadorDTO: IJogador): Promise<IJogador> {
    const jogador = new this.jogadorModel(criarJogadorDTO);

    return await jogador.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDTO: IJogador,
  ): Promise<void> {
    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogadorDTO })
      .exec();
  }

  async consultarTodosJogadores(): Promise<IJogador[]> {
    return await this.jogadorModel
      .find()
      .select([
        '_id',
        'nome',
        'categoria',
        'telefoneCelular',
        'email',
        'urlFotoJogador',
      ])
      .exec();
  }

  async consultarJogadoresPeloEmail(email: string): Promise<IJogador | null> {
    const jogadorEncontrado = await this.encontrarJogadorPorEmail(email);

    return jogadorEncontrado;
  }

  async consultarJogadorPeloId(_id: string): Promise<IJogador | null> {
    const jogadorEncontrado = await this.encontrarJogadorPorId(_id);

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    return await this.jogadorModel.deleteOne({ _id }).exec();
  }

  private async encontrarJogadorPorId(_id: string): Promise<IJogador | null> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

    return jogadorEncontrado;
  }

  private async encontrarJogadorPorEmail(
    email: string,
  ): Promise<IJogador | null> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    return jogadorEncontrado;
  }
}

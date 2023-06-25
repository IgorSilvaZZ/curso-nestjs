/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { RpcException } from '@nestjs/microservices';
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
    const { email } = criarJogadorDTO;

    const jogadorEncontrado = await this.encontrarJogadorPorEmail(email);

    if (jogadorEncontrado) {
      throw new RpcException(`Jogador com email ${email} já cadastrado!`);
    }

    const jogador = new this.jogadorModel(criarJogadorDTO);

    return await jogador.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDTO: IJogador,
  ): Promise<void> {
    const jogadorEncontrado = await this.consultarJogadorPeloId(_id);

    if (!jogadorEncontrado) {
      throw new RpcException(`Jogador com id: ${_id} não encontrado!`);
    }

    await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: atualizarJogadorDTO })
      .exec();
  }

  async consultarTodosJogadores(): Promise<IJogador[]> {
    try {
      return await this.jogadorModel
        .find()
        .select(['_id', 'nome', 'categoria'])
        .exec();
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  async consultarJogadoresPeloEmail(email: string): Promise<IJogador> {
    const jogadorEncontrado = await this.encontrarJogadorPorEmail(email);

    if (!jogadorEncontrado) {
      throw new RpcException(
        `Jogador não encontrado com email ${email} não encontrado!`,
      );
    }

    return jogadorEncontrado;
  }

  async consultarJogadorPeloId(_id: string): Promise<IJogador> {
    const jogadorEncontrado = await this.encontrarJogadorPorId(_id);

    if (!jogadorEncontrado) {
      throw new RpcException(`Jogador com id ${_id} não encontrado`);
    }

    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.encontrarJogadorPorId(_id);

    if (!jogadorEncontrado) {
      throw new RpcException(
        `Jogador não encontrado com email ${_id} não encontrado!`,
      );
    }

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

/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IDesafio } from './interfaces/desafio.interface';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';

import { Desafio } from './interfaces/desafios.schema';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('desafio')
    private readonly desafioModel: Model<Desafio>,
  ) {}

  logger = new Logger(DesafiosService.name);

  async consultarTodosDesafios(): Promise<IDesafio[]> {
    return await this.desafioModel.find().exec();
  }

  async consultarDesafioPeloId(idDesafio: string): Promise<IDesafio | null> {
    const desafioEncontrado = await this.desafioModel
      .findOne({
        _id: idDesafio,
      })
      .exec();

    return desafioEncontrado;
  }

  async consultarDesafiosDeUmJogador(idJogador: string): Promise<IDesafio[]> {
    const _id = idJogador;

    const desafiosJogador = await this.desafioModel
      .find()
      .where('jogadores')
      .in([_id])
      .exec();

    return desafiosJogador;
  }

  async criarDesafio(criarDesafio: IDesafio): Promise<IDesafio> {
    const desafioCriado = new this.desafioModel(criarDesafio);

    return await desafioCriado.save();
  }

  async atualizarDesafio(
    idDesafio: string,
    atualizarDesafio: IDesafio,
  ): Promise<IDesafio | null> {
    const desafioEncontrado = await this.desafioModel
      .findById(idDesafio)
      .exec();

    if (!desafioEncontrado) {
      return null;
    }

    let dataHoraResposta: Date;

    if (atualizarDesafio.status) {
      dataHoraResposta = new Date();
    }

    const dataDesafioAtualizado = {
      ...atualizarDesafio,
      dataHoraDesafio: atualizarDesafio.dataHoraDesafio,
      dataHoraResposta,
    };

    const desafioAtualizado = await this.desafioModel
      .findOneAndUpdate({ _id: idDesafio }, { $set: dataDesafioAtualizado })
      .exec();

    return desafioAtualizado;
  }

  async atualizarDesafioPartida(
    idPartida: string,
    desafio: IDesafio,
  ): Promise<void> {
    desafio.status = IDesafioStatusEnum.REALIZADO;
    desafio.partida = idPartida;

    this.logger.log(desafio);

    await this.desafioModel
      .findOneAndUpdate({ _id: desafio._id }, { $set: desafio })
      .exec();
  }

  async deletarDesafio(idDesafio: string): Promise<IDesafio | null> {
    const desafioEncontrado = await this.desafioModel
      .findOne({ _id: idDesafio })
      .exec();

    if (!desafioEncontrado) {
      return null;
    }

    await this.desafioModel
      .findByIdAndUpdate(
        { _id: idDesafio },
        { $set: { status: IDesafioStatusEnum.CANCELADO } },
      )
      .exec();
  }
}

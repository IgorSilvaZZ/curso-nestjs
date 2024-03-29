/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as momentTz from 'moment-timezone';

import { IDesafio } from './interfaces/desafio.interface';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';

import { Desafio } from './interfaces/desafios.schema';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('desafio')
    private readonly desafioModel: Model<Desafio>,
    private clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  logger = new Logger(DesafiosService.name);

  private clientNotifications =
    this.clientProxySmartRanking.getClientProxyInstanceNotifications();

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

  async consultarDesafiosRealizados(idCategoria: string): Promise<IDesafio[]> {
    return await this.desafioModel
      .find()
      .where('categoria')
      .equals(idCategoria)
      .where('status')
      .equals(IDesafioStatusEnum.REALIZADO)
      .exec();
  }

  async consultarDesafiosRealizadosPelaData(
    idCategoria: string,
    dataRef: string,
  ): Promise<IDesafio[]> {
    const dataRefNew = `${dataRef} 23:59:59.999`;

    return await this.desafioModel
      .find()
      .where('categoria')
      .equals(idCategoria)
      .where('status')
      .equals(IDesafioStatusEnum.REALIZADO)
      .where('dataHoraDesafio', {
        $lte: momentTz(dataRefNew)
          .tz('UTC')
          .format('YYYY-MM-DD HH:mm:ss.SSS+00:00'),
      })
      .exec();
  }

  async criarDesafio(criarDesafio: IDesafio): Promise<IDesafio> {
    const desafioCriado = new this.desafioModel(criarDesafio);

    const novoDesafio = await desafioCriado.save();

    this.clientNotifications.emit('notificacao-novo-desafio', criarDesafio);

    return novoDesafio;
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

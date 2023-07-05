/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IDesafio } from './interfaces/desafio.interface';
import { RpcException } from '@nestjs/microservices';
import { IDesafioStatusEnum } from './interfaces/desafio-status.enum';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('desafio')
    private readonly desafioModel: Model<IDesafio>,
  ) {}

  logger = new Logger(DesafiosService.name);

  async consultarTodosDesafios(): Promise<IDesafio[]> {
    return await this.desafioModel.find().exec();
  }

  async consultarDesafioPeloId(idDesafio: string): Promise<IDesafio> {
    const desafioEncontrado = await this.desafioModel.findOne({
      _id: idDesafio,
    });

    if (!desafioEncontrado) {
      throw new RpcException(`Desafio com id ${idDesafio}, não encontrada`);
    }

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
    try {
      const desafioCriado = new this.desafioModel(criarDesafio);

      return await desafioCriado.save();
    } catch (error) {
      this.logger.log(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async atualizarDesafio(
    idDesafio: string,
    atualizarDesafio: IDesafio,
  ): Promise<void> {
    try {
      const desafioEncontrado = await this.desafioModel
        .findOne({ _id: idDesafio })
        .exec();

      if (!desafioEncontrado) {
        throw new RpcException(
          `O desafio com id ${idDesafio}, não foi encontrado!`,
        );
      }

      let dataHoraResposta: Date;

      if (atualizarDesafio.status) {
        dataHoraResposta = new Date();
      }

      const desafioAtualizado = {
        ...atualizarDesafio,
        dataHoraDesafio: atualizarDesafio.dataHoraDesafio,
        dataHoraResposta,
      };

      await this.desafioModel
        .findOneAndUpdate({ _id: idDesafio }, { $set: desafioAtualizado })
        .exec();
    } catch (error) {
      this.logger.log(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async atualizarDesafioPartida(
    idPartida: string,
    desafio: IDesafio,
  ): Promise<void> {
    try {
      desafio.status = IDesafioStatusEnum.REALIZADO;
      desafio.partida = idPartida;

      await this.desafioModel
        .findOneAndUpdate({ _id: desafio._id }, { $set: desafio })
        .exec();
    } catch (error) {
      this.logger.log(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletarDesafio(idDesafio: string): Promise<void> {
    try {
      const desafioEncontrado = await this.desafioModel
        .findOne({ _id: idDesafio })
        .exec();

      if (!desafioEncontrado) {
        throw new RpcException(`Desafio com id ${idDesafio}, não encontrado!`);
      }

      await this.desafioModel
        .findByIdAndUpdate(
          { _id: idDesafio },
          { $set: { status: IDesafioStatusEnum.CANCELADO } },
        )
        .exec();
    } catch (error) {
      this.logger.log(`Error ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}

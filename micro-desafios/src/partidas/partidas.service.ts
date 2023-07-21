/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common/services';
import { RpcException } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';

import { IPartida } from './interfaces/partidas.interface';
import { IDesafio } from '../desafios/interfaces/desafio.interface';
import { ClientProxySmartRanking } from '../proxymq/client-proxy';

import { Partida } from './interfaces/partidas.schema';

@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('partida')
    private readonly partidaModel: Model<Partida>,
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  logger = new Logger(PartidasService.name);

  private clientChallenges =
    this.clientProxySmartRaking.getClientProxyInstanceChallenges();

  private clientRankings =
    this.clientProxySmartRaking.getClientProxyInstanceRankings();

  async criarPartida(criarPartida: IPartida): Promise<IPartida> {
    const partidaCriada = new this.partidaModel(criarPartida);

    const novaPartida = await partidaCriada.save();

    const idPartida = novaPartida._id;

    const desafio: IDesafio = await lastValueFrom(
      this.clientChallenges.send('consultar-desafio', {
        idDesafio: novaPartida.desafio,
      }),
    );

    this.logger.log(desafio);

    await lastValueFrom(
      this.clientChallenges.emit('atualizar-desafio-partida', {
        idPartida,
        desafio,
      }),
    );

    return await lastValueFrom(
      this.clientRankings.emit('processar-partida', {
        idPartida,
        partida: partidaCriada,
      }),
    );
  }
}

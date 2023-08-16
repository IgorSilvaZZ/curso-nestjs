/* eslint-disable prettier/prettier */

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common/services';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';

import { IPartida } from './interfaces/partidas.interface';
import { Partida } from './interfaces/partidas.schema';
import { DesafiosService } from '../desafios/desafios.service';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';
@Injectable()
export class PartidasService {
  constructor(
    @InjectModel('partida')
    private readonly partidaModel: Model<Partida>,
    private readonly desafiosService: DesafiosService,
    private readonly clientProxySmartRaking: ClientProxySmartRanking,
  ) {}

  logger = new Logger(PartidasService.name);

  private clientRankings =
    this.clientProxySmartRaking.getClientProxyInstanceRankings();

  async criarPartida(partida: IPartida): Promise<void> {
    try {
      const partidaCriada = new this.partidaModel(partida);

      const novaPartida = await partidaCriada.save();

      const idPartida = String(novaPartida._id);

      const desafio = await this.desafiosService.consultarDesafioPeloId(
        novaPartida.desafio._id,
      );

      await this.desafiosService.atualizarDesafioPartida(idPartida, desafio);

      await lastValueFrom(
        this.clientRankings.emit('processar-partida', {
          idPartida,
          partida: partidaCriada,
        }),
      );
    } catch (error) {
      this.logger.error(error);

      throw new BadRequestException(
        'Ocorreu algum erro ao realizar criação da partida!',
      );
    }
  }
}

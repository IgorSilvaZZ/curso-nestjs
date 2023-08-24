/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { Ranking } from './interfaces/ranking.schema';
import { IPartida } from './interfaces/partida.interface';
import { ICategoria } from './interfaces/categoria.interface';
import { EventoNome } from './evento-name.enum';

import { ClientProxySmartRanking } from '../proxyrmq/client-proxy';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('rankings')
    private readonly rankingModel: Model<Ranking>,
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  private clientAdminBackEnd =
    this.clientProxySmartRanking.getClientProxyInstanceAdminBackEnd();

  async processarPartida(idPartida: string, partida: IPartida): Promise<void> {
    try {
      const categoria: ICategoria = await lastValueFrom(
        this.clientAdminBackEnd.send('consultar-categoria', partida.categoria),
      );

      await Promise.all(
        partida.jogadores.map(async (idJogador) => {
          const ranking = new this.rankingModel();

          ranking.categoria = partida.categoria;
          ranking.desafio = partida.desafio;
          ranking.partida = idPartida;
          ranking.jogador = idJogador;

          if (idJogador === partida.def) {
            const eventoAtual = categoria.eventos.find(
              (evento) => evento.nome === EventoNome.VITORIA,
            );

            ranking.evento = EventoNome.VITORIA;
            ranking.pontos = eventoAtual.valor;
            ranking.operacao = eventoAtual.operacao;
          } else {
            const eventoAtual = categoria.eventos.find(
              (evento) => evento.nome === EventoNome.DERROTA,
            );

            ranking.evento = EventoNome.DERROTA;
            ranking.pontos = eventoAtual.valor;
            ranking.operacao = eventoAtual.operacao;
          }

          await ranking.save();
        }),
      );
    } catch (error) {
      this.logger.error(`Error: ${error}`);

      throw new RpcException(error.message);
    }
  }

  async consultarRankings(idCategoria: string, dataRef: string) {
    try {
      this.logger.log(`idCategoria: ${idCategoria}`);
      this.logger.log(`dataRef: ${dataRef}`);

      return { ok: true };
    } catch (error) {
      this.logger.error(`Error: ${error}`);

      throw new RpcException(error.message);
    }
  }
}

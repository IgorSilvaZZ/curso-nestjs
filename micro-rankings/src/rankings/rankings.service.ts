/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { lastValueFrom } from 'rxjs';
import * as momentTz from 'moment-timezone';
import * as _ from 'lodash';

import { Ranking } from './interfaces/ranking.schema';
import { IPartida } from './interfaces/partida.interface';
import { ICategoria } from './interfaces/categoria.interface';
import { IDesafio } from './interfaces/desafio.interface';
import { Historico, RankingResponse } from './interfaces/ranking-response';
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

  private clientProxyChallengesBackEnd =
    this.clientProxySmartRanking.getClientProxyInstanceChallenges();

  async processarPartida(idPartida: string, partida: IPartida): Promise<void> {
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
  }

  async consultarRankings(idCategoria: string, dataRef: string) {
    if (!dataRef) {
      dataRef = momentTz().tz('America/Sao_Paulo').format('YYYY-MM-DD');

      this.logger.log(`dataRef: ${dataRef}`);
    }

    // Recuperando os registros de partidas filtrando com base na categoria informada
    const registrosRanking = await this.rankingModel
      .find()
      .where('categoria')
      .equals(idCategoria)
      .exec();

    // Recuperando todos os desafios com data menor ou igual que foi informada
    // Somente desafios que foram REALIZADOS e com a categoria informada
    const desafios: IDesafio[] = await lastValueFrom(
      this.clientProxyChallengesBackEnd.send('consultar-desafios-realizado', {
        idCategoria,
        dataRef,
      }),
    );

    // Removendo os rankings que nao contem a data filtrada no send realizado acima
    // Pois fizemos a consulta de todos os rankings e depois com os desafios filtrados por data
    // Os rankings vao ser mantidos aqueles que tiverem no array de desafios com base no ID do desafio
    _.remove(registrosRanking, (item) => {
      return (
        desafios.filter((desafio) => desafio._id == item.desafio).length === 0
      );
    });

    // Agrupando a registrosRanking por jogador
    const resultado = _(registrosRanking)
      .groupBy('jogador')
      .map((items, key) => ({
        jogador: key,
        historico: _.countBy(items, 'evento'),
        pontos: _.sumBy(items, 'pontos'),
      }))
      .value();

    const resultadoOrdenado = _.orderBy(resultado, 'pontos', 'desc');

    const rankingResponseList: RankingResponse[] = [];

    resultadoOrdenado.map((item, index) => {
      const rankingResponse: RankingResponse = {};

      rankingResponse.jogador = item.jogador;
      rankingResponse.pontuacao = item.pontos;
      rankingResponse.posicao = index + 1;

      const historico: Historico = {};

      historico.vitorias = item.historico.VITORIA ?? 0;
      historico.derrotas = item.historico.DERROTA ?? 0;

      rankingResponse.historicoPartidas = historico;

      rankingResponseList.push(rankingResponse);
    });

    return rankingResponseList;
  }
}

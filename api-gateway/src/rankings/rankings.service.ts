/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

@Injectable()
export class RankingsService {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackEnd =
    this.clientProxySmartRanking.getClientProxyInstanceRankings();

  async consultarRankings(idCategoria: string, dataRef: string) {
    if (!idCategoria) {
      throw new BadRequestException('O Id da Categoria não foi informado!');
    }

    return await lastValueFrom(
      this.clientRankingsBackEnd.send('consultar-rankings', {
        idCategoria,
        dataRef: dataRef ? dataRef : '',
      }),
    );
  }
}

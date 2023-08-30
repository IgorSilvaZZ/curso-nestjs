/* eslint-disable prettier/prettier */

import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { ClientProxySmartRanking } from '../proxymq/client-proxy';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private clientProxySmartRanking: ClientProxySmartRanking) {}

  private clientRankingsBackEnd =
    this.clientProxySmartRanking.getClientProxyInstanceRankings();

  @Get()
  async consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ) {
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

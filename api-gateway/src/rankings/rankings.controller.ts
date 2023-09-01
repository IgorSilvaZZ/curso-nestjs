/* eslint-disable prettier/prettier */

import { Controller, Get, Query } from '@nestjs/common';

import { RankingsService } from './rankings.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get()
  async consultarRankings(
    @Query('idCategoria') idCategoria: string,
    @Query('dataRef') dataRef: string,
  ) {
    const rankings = await this.rankingsService.consultarRankings(
      idCategoria,
      dataRef,
    );

    return rankings;
  }
}

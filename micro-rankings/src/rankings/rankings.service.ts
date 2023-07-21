/* eslint-disable prettier/prettier */

import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Ranking } from './interfaces/ranking.schema';
import { IPartida } from './interfaces/partida.interface';

@Injectable()
export class RankingsService {
  constructor(
    @InjectModel('rankings')
    private readonly rankingsModel: Model<Ranking>,
  ) {}

  private readonly logger = new Logger(RankingsService.name);

  async processarPartida(idPartida: string, partida: IPartida): Promise<void> {
    this.logger.log(
      `idPartida: ${idPartida} - partida: ${JSON.stringify(partida)}`,
    );
  }
}
